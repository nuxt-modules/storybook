import type { RuntimeConfig } from '@nuxt/schema'

const VIRTUAL_MODULE_ID = 'virtual:nuxt-runtime-config'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`

/**
 * Provide the runtime config of the Nuxt app as a virtual module.
 */
export default function nuxtRuntimeConfigPlugin(runtimeConfig: RuntimeConfig) {
  return {
    load(id: string) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return [
          `export const runtimeConfig = ${JSON.stringify(runtimeConfig)}`,
          `export const createNuxtPayload = () => ({`,
          `  config: { app: { baseURL: '/' }, public: {}, ...runtimeConfig },`,
          `  data: {},`,
          `  serverRendered: false,`,
          `  state: {},`,
          `})`,
          `window.__NUXT__ ||= createNuxtPayload()`,
          // Based on https://github.com/nuxt/nuxt/blob/356173134280b66c5902e5129d2f5ee73b799352/packages/nuxt/src/core/templates.ts#L390-L403
          `export const ensureGlobalFetch = (ofetch) => {`,
          `  globalThis.$fetch ||= ofetch.create({ baseURL: '/' })`,
          `}`,
        ].join('\n')
      }
    },
    name: 'nuxt-runtime-config', // Required, will show up in warnings and errors
    resolveId(id: string) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },
  }
}
