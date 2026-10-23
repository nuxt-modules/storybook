import {
  genExport,
  genImport,
  genObjectFromRawEntries,
  genSafeVariableName,
  genString,
} from 'knitwork'
import { resolve } from 'pathe'
import type { Plugin } from 'vite'
import { runtimeDir } from '../../dirs'
import type { MockedComponent, MockedImport } from '../mock-calls'
import { cleanId, originalId, stemsOf, withQuery } from './module-ids'

export const MOCKED_IMPORTS_ID = 'virtual:nuxt-storybook/mocked-imports'
export const SPY_MODULE_PREFIX = '\0nuxt-storybook-spy:'
const SPIES_QUERY = 'spies'
const MOCKS_RUNTIME = resolve(runtimeDir, 'mocks')

export function mockImportsPlugin(
  mocked: MockedImport[],
  mockedComponents: MockedComponent[] = [],
): Plugin {
  // Mocked imports of each module, keyed by the resolved module id
  const modules = new Map<string, MockedImport[]>()
  const stems = new Set(mocked.flatMap((entry) => stemsOf(entry.from)))

  return {
    async buildStart() {
      const sources = [...new Set(mocked.map((entry) => entry.from))]
      const resolved = await Promise.all(
        sources.map((source) => this.resolve(source)),
      )
      for (const [index, module] of resolved.entries()) {
        const source = sources[index] ?? ''
        if (!module) {
          throw new Error(
            `[nuxt-storybook] Cannot resolve '${source}', the module of a mocked auto-import`,
          )
        }
        modules.set(
          cleanId(module.id),
          mocked.filter((entry) => entry.from === source),
        )
        for (const stem of stemsOf(module.id)) {
          stems.add(stem)
        }
      }
    },
    enforce: 'pre',
    load(id) {
      if (id === MOCKED_IMPORTS_ID) {
        return mockedImportsModule(mocked, mockedComponents)
      }
      if (id.startsWith(SPY_MODULE_PREFIX)) {
        const original = originalId(id, SPY_MODULE_PREFIX, SPIES_QUERY)
        return spyModule(original, modules.get(cleanId(original)) ?? [])
      }
    },
    name: 'nuxt-storybook-mock-imports',
    async resolveId(source, importer) {
      if (
        source === MOCKED_IMPORTS_ID ||
        source.startsWith(SPY_MODULE_PREFIX)
      ) {
        return source
      }
      // A spy module imports the original as is
      if (
        !importer ||
        importer.startsWith(SPY_MODULE_PREFIX) ||
        !stemsOf(source).some((stem) => stems.has(stem))
      ) {
        return
      }
      const resolved = await this.resolve(source, importer, { skipSelf: true })
      const spied =
        resolved && !resolved.external && modules.get(cleanId(resolved.id))
      if (spied) {
        return spyModuleId(resolved.id, spied)
      }
    },
  }
}

// Import { fn } from "storybook/test"
// Import { resolveMock } from "<runtime>/mocks"
// Import * as original from "/app/composables/useCounter.ts"
// Export * from "/app/composables/useCounter.ts"
// Export default original.default
// Export const useCounter = fn((...args) => resolveMock("useCounter", original["useCounter"])(...args)).mockName("useCounter")
function spyModule(original: string, mocked: MockedImport[]): string {
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

// Import { useCounter as __useCounter } from "/app/composables/useCounter.ts"
// Import { default as __useGreeting } from "/app/composables/useGreeting.ts"
// Export const mockedImports = {
//   UseCounter: __useCounter,
//   UseGreeting: __useGreeting
// }
// Export const mockedComponents = ["MyNuxtAvatar"]
// The imports use the auto-import sources, so `resolveId` redirects them to
// The same spy modules as every other import: the registry hands out the
// Very spy instances the components call.
function mockedImportsModule(
  mocked: MockedImport[],
  mockedComponents: MockedComponent[],
): string {
  const variable = (entry: MockedImport) => genSafeVariableName(`__${entry.as}`)
  const imports = mocked.map((entry) =>
    genImport(entry.from, [{ as: variable(entry), name: entry.name }]),
  )
  const entries = mocked.map((entry): [string, string] => [
    entry.as,
    variable(entry),
  ])
  const components = mockedComponents.map((entry) =>
    genString(entry.pascalName),
  )
  return [
    ...imports,
    `export const mockedImports = ${genObjectFromRawEntries(entries)}`,
    `export const mockedComponents = [${components.join(', ')}]`,
    '',
  ].join('\n')
}

// `\0nuxt-storybook-spy:/app/composables/a.ts?v=abc&spies=useCounter`
// The version of the original keeps every import path on one browser URL;
// The names make that URL change with the wrapper, as the browser caches
// Versioned files as immutable
function spyModuleId(id: string, mocked: MockedImport[]): string {
  const names = mocked.map((entry) => entry.as).join(',')
  return `${SPY_MODULE_PREFIX}${withQuery(id, `${SPIES_QUERY}=${names}`)}`
}
