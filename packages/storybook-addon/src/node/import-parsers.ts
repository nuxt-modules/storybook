import type { Component } from '@nuxt/schema'
import type { ImportEdge, ImportParser } from 'storybook/internal/core-server'
import type { Unimport } from 'unimport'

const SCRIPT_EXTENSIONS = ['.js', '.cjs', '.mjs', '.jsx', '.ts', '.tsx']

// todo check if nuxt can export it
const COMPONENT_USAGE_RE =
  /(?<=[\s(=;])_?resolveComponent\d*\s*\(\s*(?<quote>["'`])(?<lazy>lazy-|Lazy(?=[A-Z]))?(?<modifier>Idle|Visible|idle-|visible-|Interaction|interaction-|MediaQuery|media-query-|If|if-|Never|never-|Time|time-)?(?<name>[^'"`]*)\k<quote>[^)]*\)|(?<=\bh\s*\(\s*)(?<hLazy>lazy-|Lazy(?=[A-Z]))?(?<hModifier>Idle|Visible|idle-|visible-|Interaction|interaction-|MediaQuery|media-query-|If|if-|Never|never-|Time|time-)?(?<hName>[A-Z][\w$]*)\b/g
const TEMPLATE_BINDING_RE = /\b_ctx\.([\w$]+)\b/g

export function nuxtImportParsers(
  parsers: ImportParser[],
  components: Component[],
  unimport: Unimport,
): ImportParser[] {
  const vueParser = parsers.findLast((parser) =>
    parser.extensions.includes('.vue'),
  )
  if (!vueParser) {
    throw new Error(
      '[nuxt-storybook] @storybook/vue3 did not register its `.vue` import parser',
    )
  }

  async function autoImportEdges(code: string): Promise<ImportEdge[]> {
    const { matchedImports } = await unimport.detectImports(code)
    const names = new Map<string, Set<string> | null>()
    for (const { from, name } of matchedImports) {
      const imported = names.get(from)
      names.set(
        from,
        name === '*' || imported === null
          ? // oxlint-disable-next-line unicorn/no-null -- Storybook's edges mark namespace imports with `null`
            null
          : (imported ?? new Set()).add(name),
      )
    }
    return [...names].map(([specifier, importedNames]) => ({
      importedNames,
      kind: 'static',
      specifier,
    }))
  }

  function findComponents(name: string): Component[] {
    return components.filter(
      (component) =>
        name === component.pascalName || name === component.kebabName,
    )
  }

  function componentEdges(code: string): ImportEdge[] {
    const used = new Set<Component>()
    for (const { groups } of code.matchAll(COMPONENT_USAGE_RE)) {
      const name = groups?.name ?? groups?.hName ?? ''
      const modifier = groups?.modifier ?? groups?.hModifier ?? ''

      const found = findComponents(name)
      const matched =
        found.length === 0 && modifier ? findComponents(modifier + name) : found
      for (const component of matched) {
        used.add(component)
      }
    }
    return [...used].map((component) => ({
      importedNames: new Set([component.export ?? 'default']),
      kind: 'static',
      specifier: component.filePath,
    }))
  }

  const scriptParser: ImportParser = {
    extensions: SCRIPT_EXTENSIONS,
    async parse({ filePath, source }, ctx) {
      const edges = await ctx.parseScriptWithOxc(source, filePath)
      return [
        ...edges,
        ...(await autoImportEdges(source)),
        ...(/\.[jt]sx$/.test(filePath) ? componentEdges(source) : []),
      ]
    },
  }

  const sfcParser: ImportParser = {
    extensions: ['.vue'],
    async parse(args, ctx) {
      const edges = await vueParser.parse(args, ctx)
      const { compileTemplate, parse } = await import('vue/compiler-sfc')
      const { descriptor } = parse(args.source, { filename: args.filePath })
      const template = descriptor.template
        ? compileTemplate({
            filename: args.filePath,
            id: args.filePath,
            preprocessLang: descriptor.template.lang,
            source: descriptor.template.content,
          })
        : undefined
      const [error] = template?.errors ?? []
      if (error) {
        throw new Error(
          `[nuxt-storybook] Cannot compile the template of ${args.filePath}: ${String(error)}`,
        )
      }
      const render = template?.code ?? ''
      // Template bindings are auto-imported as if the script used them
      const scripts = [descriptor.script, descriptor.scriptSetup]
        .map((block) => block?.content ?? '')
        .join('\n')
      const bindings = [...render.matchAll(TEMPLATE_BINDING_RE)]
        .map(([, name]) => `${name};`)
        .join('\n')
      return [
        ...edges,
        ...(await autoImportEdges(`${scripts}\n${bindings}`)),
        ...componentEdges(render),
      ]
    },
  }

  return [...parsers, scriptParser, sfcParser]
}
