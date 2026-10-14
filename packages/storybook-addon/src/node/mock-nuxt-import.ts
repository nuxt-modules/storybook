import { readFileSync } from 'node:fs'
import { parseSync } from 'oxc-parser'
import { normalize, relative, resolve } from 'pathe'
import type { CallExpression, Expression, Node, Statement } from 'oxc-parser'
import type { StorybookConfig } from '../types.d'
import type { ImportMap, MockedImport } from './plugins/mock-imports'

type ViteFinalOptions = Parameters<NonNullable<StorybookConfig['viteFinal']>>[1]

type StoriesEntry = Extract<
  NonNullable<StorybookConfig['stories']>,
  unknown[]
>[number]

/** What `readMockedImports` found: the story files and the names they mock. */
export interface MockedImportsScan {
  files: string[]
  names: string[]
}

interface MockCall {
  /** Where the last argument ends, to append the story file after it. */
  argumentsEnd: number
  name: string
}

export const MOCK_CALL = 'mockNuxtImport'

const SCRIPT_FILE_RE = /\.[cm]?[jt]sx?$/

// Storybook's default for story entries without `files`
const DEFAULT_STORY_FILES = '**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))'

const PREVIEW_FILES = 'preview.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'

/** Lists the story files and the names they give to `mockNuxtImport()`. */
export async function readMockedImports(
  options: ViteFinalOptions,
): Promise<MockedImportsScan> {
  const files = await listScriptFiles(options)
  const names = new Set<string>()
  for (const file of files) {
    for (const name of extractMockedImports(readFileSync(file, 'utf8'), file)) {
      names.add(name)
    }
  }
  return { files, names: [...names] }
}

/** Collects the names of the top-level `mockNuxtImport()` calls of a file. */
export function extractMockedImports(code: string, file: string): string[] {
  return findMockCalls(code, file).map((call) => call.name)
}

/**
 * Appends the story's import path to each call, so the runtime knows the file:
 *
 *   mockNuxtImport('useCounter', factory)
 *   mockNuxtImport('useCounter', factory, "./components/MyNuxtState.stories.ts")
 */
export function injectImportPath(
  code: string,
  file: string,
  importPath: string,
): string {
  let result = code
  for (const call of findMockCalls(code, file).toReversed()) {
    const { argumentsEnd } = call
    result = `${result.slice(0, argumentsEnd)}, ${JSON.stringify(importPath)}${result.slice(argumentsEnd)}`
  }
  return result
}

/** The `parameters.fileName` Storybook gives the stories of a file. */
export function storyImportPath(
  file: string,
  workingDir = process.cwd(),
): string {
  return `./${relative(workingDir, file)}`
}

/** Resolves the names to their auto-imports, refusing unknown names. */
export function resolveMockedImports(
  names: string[],
  imports: ImportMap,
): MockedImport[] {
  return names.map((name) => {
    const entry = imports.get(name)
    if (!entry) {
      throw new Error(
        `${MOCK_CALL}('${name}'): '${name}' is not a Nuxt auto-import`,
      )
    }
    return entry
  })
}

async function listScriptFiles(options: ViteFinalOptions): Promise<string[]> {
  const { resolveFiles } = await import('@nuxt/kit')
  const { configDir } = options
  const entries = await options.presets.apply<StoriesEntry[]>(
    'stories',
    [],
    options,
  )
  const files = await Promise.all(
    entries.map((entry) =>
      typeof entry === 'string'
        ? resolveFiles(configDir, entry)
        : resolveFiles(
            resolve(configDir, entry.directory),
            entry.files ?? DEFAULT_STORY_FILES,
          ),
    ),
  )
  const preview = await resolveFiles(configDir, PREVIEW_FILES)
  return [...files.flat(), ...preview]
    .filter((file) => SCRIPT_FILE_RE.test(file))
    .map((file) => normalize(file))
}

// Only top-level calls are accepted: the build reads them, and a nested call
// would run per story, where the runtime has no file to attach the mock to
function findMockCalls(code: string, file: string): MockCall[] {
  const { program } = parseSync(file, code)
  const topLevel = program.body.flatMap(topLevelExpressions).filter(isMockCall)

  walk(program, (node) => {
    if (
      node.type === 'CallExpression' &&
      isMockCall(node) &&
      !topLevel.includes(node)
    ) {
      throw new Error(
        `${file}: ${MOCK_CALL}() must be called at the top level of the story file`,
      )
    }
  })

  return topLevel.map((call) => {
    const [name] = call.arguments
    if (name?.type !== 'Literal' || typeof name.value !== 'string') {
      throw new Error(
        `${file}: ${MOCK_CALL}() needs a string literal as name, as it is read at build time`,
      )
    }
    return {
      argumentsEnd: (call.arguments.at(-1) ?? name).end,
      name: name.value,
    }
  })
}

function topLevelExpressions(statement: Statement): Expression[] {
  switch (statement.type) {
    case 'ExpressionStatement':
      return [unwrap(statement.expression)]
    case 'VariableDeclaration':
      return statement.declarations.flatMap(({ init }) =>
        init ? [unwrap(init)] : [],
      )
    case 'ExportNamedDeclaration':
      return statement.declaration
        ? topLevelExpressions(statement.declaration)
        : []
    default:
      return []
  }
}

// `mockNuxtImport(...) as Mock` and `(mockNuxtImport(...))`
function unwrap(expression: Expression): Expression {
  switch (expression.type) {
    case 'ParenthesizedExpression':
    case 'TSAsExpression':
    case 'TSSatisfiesExpression':
      return unwrap(expression.expression)
    default:
      return expression
  }
}

function isMockCall(node: Node): node is CallExpression {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === MOCK_CALL
  )
}

function walk(node: Node, visit: (node: Node) => void): void {
  visit(node)
  for (const [key, value] of Object.entries(node)) {
    if (key === 'parent') {
      continue
    }
    for (const child of Array.isArray(value) ? value : [value]) {
      if (isNode(child)) {
        walk(child, visit)
      }
    }
  }
}

function isNode(value: unknown): value is Node {
  return typeof value === 'object' && value !== null && 'type' in value
}
