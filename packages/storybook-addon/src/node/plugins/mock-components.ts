import { genExport, genImport, genString } from 'knitwork'
import { resolve } from 'pathe'
import type { Plugin } from 'vite'
import { runtimeDir } from '../../dirs'
import type { MockedComponent } from '../mock-calls'
import { cleanId, stemsOf } from './module-ids'

// The original id goes in the query: an id ending in `.vue` would be taken
// for a single-file component by the Vue plugin
export const COMPONENT_MODULE_PREFIX = '\0nuxt-storybook-component?original='
const RUNTIME = resolve(runtimeDir, 'mockable-component')

export function mockComponentsPlugin(
  mocked: MockedComponent[],
  serverComponentRuntime: string,
): Plugin {
  // Mocked components of each module, keyed by the resolved module id
  const modules = new Map<string, MockedComponent[]>()
  const stems = new Set<string>()
  const servers = mocked.filter((entry) => entry.server)
  let serverRuntimeId: string | undefined

  return {
    async buildStart() {
      // A server component is also wrapped as a file, for direct imports
      const files = [...new Set(mocked.map((entry) => entry.filePath))]
      const sources =
        servers.length > 0 ? [...files, serverComponentRuntime] : files
      const resolved = await Promise.all(
        sources.map((source) => this.resolve(source)),
      )
      for (const [index, module] of resolved.entries()) {
        const source = sources[index] ?? ''
        if (!module) {
          throw new Error(
            `[nuxt-storybook] Cannot resolve '${source}', the module of a mocked component`,
          )
        }
        const id = cleanId(module.id)
        if (source === serverComponentRuntime) {
          serverRuntimeId = id
        } else {
          modules.set(
            id,
            mocked.filter((entry) => entry.filePath === source),
          )
        }
        for (const stem of stemsOf(module.id)) {
          stems.add(stem)
        }
      }
    },
    enforce: 'pre',
    load(id) {
      if (!id.startsWith(COMPONENT_MODULE_PREFIX)) {
        return
      }
      const original = decodeURIComponent(
        id.slice(COMPONENT_MODULE_PREFIX.length),
      )
      return cleanId(original) === serverRuntimeId
        ? serverComponentsModule(original)
        : componentsModule(original, modules.get(cleanId(original)) ?? [])
    },
    name: 'nuxt-storybook-mock-components',
    async resolveId(source, importer) {
      if (source.startsWith(COMPONENT_MODULE_PREFIX)) {
        return source
      }

      if (
        !importer ||
        importer.startsWith(COMPONENT_MODULE_PREFIX) ||
        source.includes('?vue') ||
        !stemsOf(source).some((stem) => stems.has(stem))
      ) {
        return
      }
      const resolved = await this.resolve(source, importer, { skipSelf: true })
      if (!resolved || resolved.external) {
        return
      }
      const id = cleanId(resolved.id)
      if (id === serverRuntimeId || modules.has(id)) {
        return `${COMPONENT_MODULE_PREFIX}${encodeURIComponent(resolved.id)}`
      }
    },
  }
}

// Import { mockableComponent } from "<runtime>/mockable-component"
// Import * as original from "/app/components/MyNuxtAvatar.vue"
// Export * from "/app/components/MyNuxtAvatar.vue"
// Export default mockableComponent("MyNuxtAvatar", original.default)
// Export const NuxtLink = mockableComponent("NuxtLink", original["NuxtLink"])
function componentsModule(original: string, mocked: MockedComponent[]): string {
  const wrap = ({ name, pascalName }: MockedComponent) =>
    `mockableComponent(${genString(pascalName)}, original[${genString(name)}])`
  const defaultEntry = mocked.find((entry) => entry.name === 'default')
  const named = mocked.filter((entry) => entry.name !== 'default')

  return [
    genImport(RUNTIME, ['mockableComponent']),
    genImport(original, { as: 'original', name: '*' }),
    genExport(original, '*'),
    defaultEntry
      ? `export default ${wrap(defaultEntry)}`
      : 'export default original.default',
    ...named.map((entry) => `export const ${entry.name} = ${wrap(entry)}`),
    '',
  ].join('\n')
}

// Import { mockableComponent } from "<runtime>/mockable-component"
// Import * as original from "<nuxt>/components/runtime/server-component.js"
// Export * from "<nuxt>/components/runtime/server-component.js"
// Export const createServerComponent = (name) => mockableComponent(name, original.createServerComponent(name))
function serverComponentsModule(original: string): string {
  return [
    genImport(RUNTIME, ['mockableComponent']),
    genImport(original, { as: 'original', name: '*' }),
    genExport(original, '*'),
    'export const createServerComponent = (name) => mockableComponent(name, original.createServerComponent(name))',
    '',
  ].join('\n')
}
