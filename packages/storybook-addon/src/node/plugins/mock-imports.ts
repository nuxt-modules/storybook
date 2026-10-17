import {
  genExport,
  genImport,
  genObjectFromRawEntries,
  genSafeVariableName,
  genString,
} from 'knitwork'
import { basename, extname, normalize, resolve } from 'pathe'
import type { Plugin } from 'vite'
import { runtimeDir } from '../../dirs'
import {
  MOCK_CALL,
  injectImportPath,
  storyImportPath,
} from '../mock-nuxt-import'

export interface MockedImport {
  as: string
  from: string
  name: string
}

export interface MockOptions {
  imports: MockedImport[]
  storyFiles: string[]
}

export const MOCKED_IMPORTS_ID = 'virtual:nuxt-storybook/mocked-imports'
export const SPY_MODULE_PREFIX = '\0nuxt-storybook-spy:'
const ORIGINAL_QUERY = 'nuxt-storybook-original'
const SPIES_QUERY = 'spies'
const MOCKS_RUNTIME = resolve(runtimeDir, 'mocks')

export function mockImportsPlugin({
  imports: mocked,
  storyFiles,
}: MockOptions): Plugin {
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

// import { fn } from "storybook/test"
// import { resolveMock } from "<runtime>/mocks"
// import * as original from "/app/composables/useCounter.ts?nuxt-storybook-original"
// export * from "/app/composables/useCounter.ts?nuxt-storybook-original"
// export default original.default
// export const useCounter = fn((...args) => resolveMock("useCounter", original["useCounter"])(...args)).mockName("useCounter")
function spyModule(id: string, mocked: MockedImport[]): string {
  const original = withOriginalQuery(id)
  const spy = ({ as, name }: MockedImport) => {
    const target = `resolveMock(${genString(as)}, original[${genString(name)}])`
    return `fn((...args) => ${target}(...args)).mockName(${genString(as)})`
  }
  const defaultEntry = mocked.find((entry) => entry.name === 'default')
  const named = mocked.filter((entry) => entry.name !== 'default')

  return [
    genImport('storybook/test', ['fn']),
    genImport(MOCKS_RUNTIME, ['resolveMock']),
    genImport(original, { as: 'original', name: '*' }),
    genExport(original, '*'),
    // Modules without a default export give `undefined`, which passes through
    defaultEntry
      ? `export default ${spy(defaultEntry)}`
      : 'export default original.default',
    ...named.map((entry) => `export const ${entry.name} = ${spy(entry)}`),
    '',
  ].join('\n')
}

// import { useCounter as __useCounter } from "/app/composables/useCounter.ts"
// import { default as __useGreeting } from "/app/composables/useGreeting.ts"
// export const mockedImports = {
//   useCounter: __useCounter,
//   useGreeting: __useGreeting
// }
function mockedImportsModule(mocked: MockedImport[]): string {
  const variable = (entry: MockedImport) => genSafeVariableName(`__${entry.as}`)
  const imports = mocked.map((entry) =>
    genImport(entry.from, [{ as: variable(entry), name: entry.name }]),
  )
  const entries = mocked.map((entry): [string, string] => [
    entry.as,
    variable(entry),
  ])
  return [
    ...imports,
    `export const mockedImports = ${genObjectFromRawEntries(entries)}`,
    '',
  ].join('\n')
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
