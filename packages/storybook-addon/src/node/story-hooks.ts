import { genImport } from 'knitwork'
import MagicString from 'magic-string'
import { Visitor, parseSync } from 'oxc-parser'
import { resolve } from 'pathe'
import { createTransformer } from 'unctx/transform'
import type { SourceMap } from 'magic-string'
import type { ObjectPropertyKind } from 'oxc-parser'
import { runtimeDir } from '../dirs'

export const SPIES_RUNTIME = resolve(runtimeDir, 'story-spies')

/** The local name of `inStoryContext`, which the `await`s are transformed in. */
export const IN_STORY_CONTEXT = '__nuxtStorybookInStoryContext'

const awaits = createTransformer({
  asyncFunctions: [IN_STORY_CONTEXT],
  helperModule: SPIES_RUNTIME,
  helperName: 'executeStoryAsync',
})

/** The annotations of a story or a meta running story code. */
export const DEFAULT_STORY_HOOKS = [
  'afterEach',
  'beforeEach',
  'loaders',
  'play',
]

export function hasStoryHook(code: string, hooks: string[]): boolean {
  return hooks.some((hook) => code.includes(hook))
}

/**
 * Wraps the hooks written in a story file to run in the context of their story:
 *
 *     beforeEach() {}            ->  beforeEach: inStoryContext(function () {})
 *     play: async () => {}       ->  play: inStoryContext(async () => {})
 *     loaders: [loadUser]        ->  loaders: [inStoryContext(loadUser)]
 */
export function wrapStoryHooks(
  code: string,
  file: string,
  hooks = DEFAULT_STORY_HOOKS,
): { code: string; map: SourceMap } | undefined {
  const source = new MagicString(code)
  const wrap = (start: number, end: number) => {
    source.appendRight(start, `${IN_STORY_CONTEXT}(`)
    source.appendLeft(end, ')')
  }

  new Visitor({
    ObjectExpression(object) {
      for (const node of object.properties) {
        wrapHook(node)
      }
    },
  }).visit(parseSync(file, code).program)

  function wrapHook(node: ObjectPropertyKind) {
    const name = hookName(node, hooks)
    if (!name || node.type !== 'Property') {
      return
    }
    const { value } = node
    if (node.shorthand) {
      source.overwrite(
        node.start,
        node.end,
        `${name}: ${IN_STORY_CONTEXT}(${name})`,
      )
    } else if (node.method && value.type === 'FunctionExpression') {
      // The method becomes a function expression, keeping its `this`
      const keyword = value.async ? 'async function' : 'function'
      const star = value.generator ? '*' : ''
      const parameters = code.indexOf('(', node.key.end)
      source.overwrite(
        node.start,
        parameters,
        `${name}: ${IN_STORY_CONTEXT}(${keyword}${star} `,
      )
      source.appendLeft(node.end, ')')
    } else if (value.type === 'ArrayExpression') {
      for (const element of value.elements) {
        if (element && element.type !== 'SpreadElement') {
          wrap(element.start, element.end)
        }
      }
    } else {
      wrap(value.start, value.end)
    }
  }

  if (!source.hasChanged()) {
    return undefined
  }
  source.prepend(
    `${genImport(SPIES_RUNTIME, [{ as: IN_STORY_CONTEXT, name: 'inStoryContext' }])}\n`,
  )
  return { code: source.toString(), map: source.generateMap({ hires: true }) }
}

function hookName(
  node: ObjectPropertyKind,
  hooks: string[],
): string | undefined {
  if (node.type !== 'Property' || node.computed || node.kind !== 'init') {
    return undefined
  }
  const { key } = node
  const name = key.type === 'Identifier' ? key.name : undefined
  return name !== undefined && hooks.includes(name) ? name : undefined
}

export function keepStoryContext(
  code: string,
  file: string,
): { code: string; map: string } | undefined {
  const result = awaits.shouldTransform(code)
    ? awaits.transform(code)
    : undefined
  return (
    result && {
      code: result.code,
      map: result.magicString
        .generateMap({ hires: true, includeContent: true, source: file })
        .toString(),
    }
  )
}
