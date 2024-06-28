import type { RuntimeConfig } from '@nuxt/schema'

/**
 * Provide the runtime config of the Nuxt app as a virtual module.
 */
export default function nuxtRuntimeConfigPlugin(runtimeConfig: RuntimeConfig) {
  const virtualModuleId = 'virtual:nuxt-runtime-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'nuxt-runtime-config', // required, will show up in warnings and errors
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export const runtimeConfig = ${JSON.stringify(runtimeConfig)};`
      }
    },
  }
}
