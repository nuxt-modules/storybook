import { basename, extname, normalize, resolve } from 'pathe'
import { resolvePreset } from 'unimport'
import type { Nuxt } from '@nuxt/schema'
import type { Import } from 'unimport'
import type { Plugin } from 'vite'
import { runtimeDir } from '../../dirs'
import {
  MOCK_CALL,
  injectImportPath,
  storyImportPath,
} from '../mock-nuxt-import'

/** A runtime auto-import: the export `name` of `from`, used as `as`. */
export interface MockedImport {
  as: string
  from: string
  name: string
}

/** The runtime auto-imports, keyed by the name they are used as. */
export type ImportMap = Map<string, MockedImport>

export interface MockOptions {
  /** The auto-imports to turn into spies. */
  imports: MockedImport[]
  /** The story files whose `mockNuxtImport()` calls get their file appended. */
  storyFiles: string[]
}

export const MOCKED_IMPORTS_ID = 'virtual:nuxt-storybook/mocked-imports'

const SPY_MODULE_PREFIX = '\0nuxt-storybook-spy:'

// Marks the imports of the original modules, which must not be redirected
const ORIGINAL_QUERY = 'nuxt-storybook-original'

// Names the mocked exports in the spy module id
const SPIES_QUERY = 'spies'

const MOCKS_RUNTIME = resolve(runtimeDir, 'mocks')

/** Collects every runtime auto-import, presets included. */
export function collectNuxtImports(nuxt: Nuxt): ImportMap {
  const imports: ImportMap = new Map()
  const add = (entries: Import[]) => {
    for (const entry of entries) {
      if (!entry.type) {
        const as = entry.as ?? entry.name
        imports.set(as, { as, from: entry.from, name: entry.name })
      }
    }
  }

  nuxt.hook('imports:sources', async (presets) => {
    const resolved = await Promise.all(presets.map(resolvePreset))
    add(resolved.flat())
  })
  nuxt.hook('imports:extend', add)

  return imports
}

/**
 * Redirects the imports of the mocked modules to a wrapper exporting the
 * mocked names as `storybook/test` spies, serves the spies by name to
 * `mockNuxtImport()` and tells it which story file calls it.
 */
export function mockImportsPlugin({
  imports: mocked,
  storyFiles,
}: MockOptions): Plugin {
  // The mocked imports of each module, keyed by the resolved module id
  const modules = new Map<string, MockedImport[]>()
  const stems = new Set(mocked.map((entry) => stem(entry.from)))
  const stories = new Set(storyFiles.map((file) => normalize(file)))

  return {
    name: 'nuxt-storybook-mock-imports',
    enforce: 'pre',
    async buildStart() {
      const sources = [...new Set(mocked.map((entry) => entry.from))]
      const resolved = await Promise.all(
        sources.map((source) => this.resolve(source)),
      )
      for (const [index, module] of resolved.entries()) {
        if (module) {
          const source = sources[index]
          modules.set(
            cleanId(module.id),
            mocked.filter((entry) => entry.from === source),
          )
        }
      }
    },
    async resolveId(source, importer) {
      if (
        source === MOCKED_IMPORTS_ID ||
        source.startsWith(SPY_MODULE_PREFIX) ||
        source.includes(ORIGINAL_QUERY)
      ) {
        return source
      }
      // Only files named like a mocked module can resolve to one
      if (!importer || !stems.has(stem(source))) {
        return
      }
      const resolved = await this.resolve(source, importer, { skipSelf: true })
      const spied =
        resolved && !resolved.external && modules.get(cleanId(resolved.id))
      if (spied) {
        return spyModuleId(resolved.id, spied)
      }
    },
    load(id) {
      if (id === MOCKED_IMPORTS_ID) {
        return mockedImportsModule(mocked)
      }
      if (id.startsWith(SPY_MODULE_PREFIX)) {
        const original = originalId(id)
        return spyModule(original, modules.get(cleanId(original)) ?? [])
      }
    },
    transform(code, id) {
      const file = cleanId(id)
      if (!stories.has(file) || !code.includes(MOCK_CALL)) {
        return
      }
      return {
        code: injectImportPath(code, file, storyImportPath(file)),
        map: null,
      }
    },
  }
}

// import { fn } from 'storybook/test'
// import { resolveMock } from "<runtime>/mocks"
// import * as original from "/app/composables/useCounter.ts?nuxt-storybook-original"
// export * from "/app/composables/useCounter.ts?nuxt-storybook-original"
// export default original.default
// export const useCounter = fn((...args) => resolveMock("useCounter", original["useCounter"])(...args)).mockName("useCounter")
function spyModule(id: string, mocked: MockedImport[]): string {
  const original = JSON.stringify(withOriginalQuery(id))
  const spy = ({ as, name }: MockedImport) => {
    const target = `resolveMock(${JSON.stringify(as)}, original[${JSON.stringify(name)}])`
    return `fn((...args) => ${target}(...args)).mockName(${JSON.stringify(as)})`
  }
  const defaultEntry = mocked.find((entry) => entry.name === 'default')
  const named = mocked.filter((entry) => entry.name !== 'default')

  return [
    `import { fn } from 'storybook/test'`,
    `import { resolveMock } from ${JSON.stringify(MOCKS_RUNTIME)}`,
    `import * as original from ${original}`,
    `export * from ${original}`,
    defaultEntry
      ? `export default ${spy(defaultEntry)}`
      : 'export default original.default',
    ...named.map((entry) => `export const ${entry.name} = ${spy(entry)}`),
    '',
  ].join('\n')
}

// import { useCounter as __0 } from "/app/composables/useCounter.ts"
// export const mockedImports = { "useCounter": __0 }
function mockedImportsModule(mocked: MockedImport[]): string {
  const imports = mocked.map(
    (entry, index) =>
      `import { ${entry.name} as __${index} } from ${JSON.stringify(entry.from)}`,
  )
  const entries = mocked.map(
    (entry, index) => `${JSON.stringify(entry.as)}: __${index}`,
  )
  return `${imports.join('\n')}\nexport const mockedImports = { ${entries.join(', ')} }\n`
}

// `\0nuxt-storybook-spy:/app/composables/a.ts?v=abc&spies=useCounter`
// The version of the original keeps every import path on one browser URL;
// the names make that URL change with the wrapper, as the browser caches
// versioned files as immutable
function spyModuleId(id: string, mocked: MockedImport[]): string {
  const names = mocked.map((entry) => entry.as).join(',')
  return `${SPY_MODULE_PREFIX}${withQuery(id, `${SPIES_QUERY}=${names}`)}`
}

function originalId(spyId: string): string {
  const [file = '', query] = spyId.slice(SPY_MODULE_PREFIX.length).split('?')
  const params = new URLSearchParams(query)
  params.delete(SPIES_QUERY)
  return params.size > 0 ? `${file}?${params.toString()}` : file
}

function withOriginalQuery(id: string): string {
  return withQuery(id, ORIGINAL_QUERY)
}

function withQuery(id: string, query: string): string {
  return `${id}${id.includes('?') ? '&' : '?'}${query}`
}

function cleanId(id: string): string {
  return normalize(id.split('?')[0] ?? id)
}

// `#app/composables/router` and `.../router.js` share the stem `router`
function stem(path: string): string {
  const file = cleanId(path)
  return basename(file, extname(file))
}
