import { readFile, stat } from 'node:fs/promises'
import { genString } from 'knitwork'
import MagicString from 'magic-string'
import { Visitor, parseSync } from 'oxc-parser'
import { normalize, relative, resolve } from 'pathe'
import type { SourceMap } from 'magic-string'
import type { CallExpression, Expression, Statement } from 'oxc-parser'
import type { Import } from 'unimport'
import type { StorybookConfig } from '../types.d'

/** A runtime auto-import: the export `name` of `from`, used as `as`. */
export interface MockedImport {
  as: string
  from: string
  name: string
}

type ViteFinalOptions = Parameters<NonNullable<StorybookConfig['viteFinal']>>[1]

type StoriesEntry = Extract<
  NonNullable<StorybookConfig['stories']>,
  unknown[]
>[number]

interface MockCall {
  /** Where the last argument ends, to append the story file after it. */
  argumentsEnd: number
  name: string
}

export const MOCK_CALL = 'mockNuxtImport'

export const SCRIPT_FILE_RE = /\.[cm]?[jt]sx?$/

// Storybook's default for story entries without `files`
const DEFAULT_STORY_FILES = '**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))'

export async function readMockedNames(
  options: ViteFinalOptions,
): Promise<string[]> {
  const files = await listStoryFiles(options)
  const names = await Promise.all(
    files.map(async (file) => {
      const code = await readFile(file, 'utf8')
      return code.includes(MOCK_CALL) ? extractMockedNames(code, file) : []
    }),
  )
  return [...new Set(names.flat())]
}

export function extractMockedNames(code: string, file: string): string[] {
  return findMockCalls(code, file).map((call) => call.name)
}

/**
 * Appends the story's import path and the transform generation to each call,
 * so the runtime knows the file and tells a re-evaluation (HMR) from a first:
 *
 *   mockNuxtImport('useCounter', factory)
 *   mockNuxtImport('useCounter', factory, "./components/MyNuxtState.stories.ts", 1)
 */
export function injectStoryFile(
  code: string,
  file: string,
  importPath: string,
  generation: number,
): { code: string; map: SourceMap } {
  const source = new MagicString(code)
  for (const { argumentsEnd } of findMockCalls(code, file)) {
    source.appendLeft(argumentsEnd, `, ${genString(importPath)}, ${generation}`)
  }
  return { code: source.toString(), map: source.generateMap({ hires: true }) }
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
    // TypeScript already reports the name; the story file fails at runtime
    if (!entry) {
      console.warn(
        `[nuxt-storybook] ${MOCK_CALL}('${as}'): '${as}' is not a Nuxt auto-import`,
      )
      return []
    }
    return [{ as, from: entry.from, name: entry.name }]
  })
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

function findMockCalls(code: string, file: string): MockCall[] {
  const { program } = parseSync(file, code)
  const topLevel = new Set(
    program.body.flatMap(topLevelExpressions).filter(isMockCall),
  )

  new Visitor({
    CallExpression(node) {
      if (isMockCall(node) && !topLevel.has(node)) {
        throw new Error(
          `${file}: ${MOCK_CALL}() must be called at the top level of the story file`,
        )
      }
    },
  }).visit(program)

  const names = new Set<string>()
  return [...topLevel].map((call) => {
    const [name] = call.arguments
    if (name?.type !== 'Literal' || typeof name.value !== 'string') {
      throw new Error(
        `${file}: ${MOCK_CALL}() needs a string literal as name, as it is read at build time`,
      )
    }
    if (names.has(name.value)) {
      throw new Error(
        `${file}: '${name.value}' is mocked twice. Each auto-import can only be mocked once per story file.`,
      )
    }
    names.add(name.value)
    return {
      argumentsEnd: (call.arguments.at(-1) ?? name).end,
      name: name.value,
    }
  })
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

function isMockCall(node: Expression): node is CallExpression {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === MOCK_CALL
  )
}
