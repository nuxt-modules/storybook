import { readFile, stat } from 'node:fs/promises'
import { genString } from 'knitwork'
import MagicString from 'magic-string'
import { Visitor, parseSync } from 'oxc-parser'
import { dirname, normalize, relative, resolve } from 'pathe'
import { resolveAlias } from 'pathe/utils'
import type { Component } from '@nuxt/schema'
import type { SourceMap } from 'magic-string'
import type { CallExpression, Expression, Program, Statement } from 'oxc-parser'
import type { Import } from 'unimport'
import type { StorybookConfig } from '../../types.d'

/** A runtime auto-import: the export `name` of `from`, used as `as`. */
export interface MockedImport {
  as: string
  from: string
  name: string
}

/** A Nuxt component: the export `name` of `filePath`, or a server island. */
export interface MockedComponent {
  filePath: string
  name: string
  pascalName: string
  server: boolean
}

/**
 * A component as a story file names it: by its PascalCase or kebab-case
 * name, or by its path, relative to the story file or with an alias.
 */
export interface ComponentReference {
  file: string
  name: string
}

export type ComponentResolver = (
  reference: ComponentReference,
) => Component | undefined

export interface MockedNames {
  components: ComponentReference[]
  imports: string[]
}

export type MockKind = keyof MockedNames

export interface MockCall {
  kind: MockKind
  name: string
}

type ViteFinalOptions = Parameters<NonNullable<StorybookConfig['viteFinal']>>[1]

type StoriesEntry = Extract<
  NonNullable<StorybookConfig['stories']>,
  unknown[]
>[number]

export const MOCK_CALLS: Record<MockKind, string> = {
  components: 'mockComponent',
  imports: 'mockNuxtImport',
}

export const SCRIPT_FILE_RE = /\.[cm]?[jt]sx?$/

/** Auto-imports always mocked: the preview keeps `navigateTo` in the story. */
export const BUILT_IN_MOCKS = ['navigateTo']

const ENDPOINT_CALL = 'registerEndpoint'

// The top-level calls told the story file they are in
const FILE_CALLS = new Set([...Object.values(MOCK_CALLS), ENDPOINT_CALL])

// Storybook's default for story entries without `files`
const DEFAULT_STORY_FILES = '**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))'

const KINDS = Object.keys(MOCK_CALLS) as MockKind[]

export async function readMockedNames(
  options: ViteFinalOptions,
): Promise<MockedNames> {
  const files = await listStoryFiles(options)
  const calls = await Promise.all(
    files.map(async (file) => {
      const code = await readFile(file, 'utf8')
      return hasFileCall(code)
        ? findMockCalls(code, file).map(({ kind, name }) => ({
            file,
            kind,
            name,
          }))
        : []
    }),
  )
  const components = calls.flat().filter((call) => call.kind === 'components')
  return {
    components: components.map(({ file, name }) => ({ file, name })),
    imports: uniqueNames(calls.flat(), 'imports'),
  }
}

export function hasFileCall(code: string): boolean {
  return [...FILE_CALLS].some((callee) => code.includes(callee))
}

/**
 * Appends the story's import path and the transform generation to each
 * top-level mock and `registerEndpoint` call: without them, a call applies
 * to the story whose hook is running. Names each mock as the runtime does.
 */
export function injectStoryFile(
  code: string,
  file: string,
  importPath: string,
  generation: number,
  resolveComponent?: ComponentResolver,
): { code: string; map: SourceMap } {
  const { program } = parseSync(file, code)
  validateMockCalls(program, file)
  const source = new MagicString(code)
  const fileArguments = `, ${genString(importPath)}, ${generation}`
  for (const call of findFileCalls(program.body, file)) {
    // `mockNuxtImport('useState')` has no factory
    const factory = call.arguments.length === 1 ? ', undefined' : ''
    source.appendLeft(call.arguments.at(-1)!.end, factory + fileArguments)
  }
  for (const call of findMockCallNodes(program)) {
    const [target] = call.arguments
    const name = runtimeName(call, file, resolveComponent)
    if (target && name !== undefined) {
      source.update(target.start, target.end, genString(name))
    }
  }
  return { code: source.toString(), map: source.generateMap({ hires: true }) }
}

/** Finds the Nuxt component a story file names, as `@nuxt/test-utils` does. */
export function createComponentResolver(
  components: Component[],
  alias: Record<string, string>,
): ComponentResolver {
  return ({ file, name }) => {
    const path = withoutExtension(
      name.startsWith('.')
        ? resolve(dirname(file), name)
        : normalize(resolveAlias(name, alias)),
    )
    return findComponent(
      components,
      (component) =>
        component.pascalName === name ||
        component.kebabName === name ||
        withoutExtension(normalize(component.filePath)) === path,
    )
  }
}

export function storyImportPath(
  file: string,
  workingDir = process.cwd(),
): string {
  const path = relative(workingDir, file)
  return path.startsWith('../') ? path : `./${path}`
}

export function resolveMockedImports(
  names: string[],
  imports: Import[],
): MockedImport[] {
  const byName = new Map<string, Import>()
  for (const entry of imports) {
    if (!entry.disabled && !entry.type) {
      byName.set(entry.as ?? entry.name, entry)
    }
  }

  return names.flatMap((as) => {
    const entry = byName.get(as)

    if (!entry) {
      if (!BUILT_IN_MOCKS.includes(as)) {
        warnUnknown('imports', as, 'a Nuxt auto-import')
      }
      return []
    }
    return [{ as, from: entry.from, name: entry.name }]
  })
}

export function resolveMockedComponents(
  references: ComponentReference[],
  resolveComponent: ComponentResolver,
): MockedComponent[] {
  const mocked = new Map<string, MockedComponent>()
  for (const reference of references) {
    const component = resolveComponent(reference)
    if (component) {
      mocked.set(component.pascalName, {
        filePath: component.filePath,
        name: component.export,
        pascalName: component.pascalName,
        server: component.mode === 'server',
      })
    } else {
      warnUnknown('components', reference.name, 'a Nuxt component')
    }
  }
  return [...mocked.values()]
}

export function findMockCalls(code: string, file: string): MockCall[] {
  return validateMockCalls(parseSync(file, code).program, file)
}

// Calls in story hooks are `registerEndpoint(context, ...)`, scoped by the context
function findFileCalls(body: Statement[], file: string): CallExpression[] {
  const calls = body.flatMap(topLevelExpressions).filter(isFileCall)
  for (const call of calls) {
    if (calleeName(call) === ENDPOINT_CALL && call.arguments.length < 2) {
      throw new Error(`${file}: ${ENDPOINT_CALL}() needs a url and an endpoint`)
    }
  }
  return calls
}

// The mock calls of the top level and those of the story hooks
function findMockCallNodes(program: Program): CallExpression[] {
  const calls: CallExpression[] = []
  new Visitor({
    CallExpression(node) {
      if (isMockCall(node)) {
        calls.push(node)
      }
    },
  }).visit(program)
  return calls
}

function validateMockCalls(program: Program, file: string): MockCall[] {
  const topLevel = new Set(
    program.body.flatMap(topLevelExpressions).filter(isMockCall),
  )

  const names = new Set<string>()
  return findMockCallNodes(program).map((call) => {
    const callee = calleeName(call)
    const kind = kindOf(callee) ?? 'imports'
    const [target, factory] = call.arguments
    // Like `@nuxt/test-utils`, an import is also named by itself
    const name =
      kind === 'imports' && target?.type === 'Identifier'
        ? target.name
        : target?.type === 'Literal' && target.value
    if (typeof name !== 'string') {
      throw new Error(
        `${file}: ${callee}() needs a string literal as name, as it is read at build time`,
      )
    }
    if (kind === 'components' && !factory) {
      throw new Error(
        `${file}: ${callee}('${name}') needs the mock component, or a factory returning it`,
      )
    }
    const key = `${kind}:${name}`
    // Each story may mock a name again in its hooks
    if (topLevel.has(call) && names.has(key)) {
      throw new Error(
        `${file}: '${name}' is mocked twice. Each name can only be mocked once per story file.`,
      )
    }
    names.add(key)
    return { kind, name }
  })
}

// `mockNuxtImport(useRoute, ...)` and `mockComponent('my-avatar', ...)` name
// The import and the component as the runtime registers them
function runtimeName(
  call: CallExpression,
  file: string,
  resolveComponent?: ComponentResolver,
): string | undefined {
  const [target] = call.arguments
  if (target?.type === 'Identifier') {
    return target.name
  }
  if (
    kindOf(calleeName(call)) === 'components' &&
    target?.type === 'Literal' &&
    typeof target.value === 'string'
  ) {
    return resolveComponent?.({ file, name: target.value })?.pascalName
  }
}

// Nuxt's client loader prefers the client version of a component and falls
// Back to the server one, which it renders as an island
function findComponent(
  components: Component[],
  matches: (component: Component) => boolean,
): Component | undefined {
  const candidates = components.filter(
    (component) => matches(component) && !component._raw,
  )
  return (
    candidates.find((component) => component.mode !== 'server') ?? candidates[0]
  )
}

function withoutExtension(path: string): string {
  return path.replace(/\.[^./]+$/, '')
}

function warnUnknown(kind: MockKind, name: string, expected: string) {
  console.warn(
    `[nuxt-storybook] ${MOCK_CALLS[kind]}('${name}'): '${name}' is not ${expected}`,
  )
}

function uniqueNames(calls: MockCall[], kind: MockKind): string[] {
  const names = calls.filter((call) => call.kind === kind).map((c) => c.name)
  return [...new Set(names)]
}

async function listStoryFiles(options: ViteFinalOptions): Promise<string[]> {
  const { resolveFiles } = await import('@nuxt/kit')
  const { configDir } = options
  const entries = await options.presets.apply<StoriesEntry[]>(
    'stories',
    [],
    options,
  )
  const files = await Promise.all(
    entries.map(async (entry) => {
      if (typeof entry !== 'string') {
        const directory = resolve(configDir, entry.directory)
        return resolveFiles(directory, entry.files ?? DEFAULT_STORY_FILES)
      }
      // A plain directory, like `../src`, means its default story files
      const directory = resolve(configDir, entry)
      return (await isDirectory(directory))
        ? resolveFiles(directory, DEFAULT_STORY_FILES)
        : resolveFiles(configDir, entry)
    }),
  )
  return files
    .flat()
    .filter((file) => SCRIPT_FILE_RE.test(file))
    .map((file) => normalize(file))
}

function isDirectory(path: string): Promise<boolean> {
  return stat(path).then(
    (stats) => stats.isDirectory(),
    () => false,
  )
}

// MockNuxtImport('a')
// Const a = mockNuxtImport('a')
// Export const a = mockNuxtImport('a')
function topLevelExpressions(statement: Statement): Expression[] {
  switch (statement.type) {
    case 'ExpressionStatement': {
      return [unwrap(statement.expression)]
    }
    case 'VariableDeclaration': {
      return statement.declarations.flatMap(({ init }) =>
        init ? [unwrap(init)] : [],
      )
    }
    case 'ExportNamedDeclaration': {
      return statement.declaration
        ? topLevelExpressions(statement.declaration)
        : []
    }
    default: {
      return []
    }
  }
}

// `mockNuxtImport(...) as Mock` and `(mockNuxtImport(...))`
function unwrap(expression: Expression): Expression {
  switch (expression.type) {
    case 'ParenthesizedExpression':
    case 'TSAsExpression':
    case 'TSSatisfiesExpression': {
      return unwrap(expression.expression)
    }
    default: {
      return expression
    }
  }
}

function isFileCall(node: Expression): node is CallExpression {
  return node.type === 'CallExpression' && FILE_CALLS.has(calleeName(node))
}

function isMockCall(node: Expression): node is CallExpression {
  return node.type === 'CallExpression' && kindOf(calleeName(node)) !== null
}

function calleeName(call: CallExpression): string {
  return call.callee.type === 'Identifier' ? call.callee.name : ''
}

function kindOf(callee: string): MockKind | null {
  return KINDS.find((kind) => MOCK_CALLS[kind] === callee) ?? null
}
