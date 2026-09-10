import type { RuntimeConfig } from '@nuxt/schema'

/**
 * Provide the runtime config of the Nuxt app as a virtual module.
 */
export default function nuxtRuntimeConfigPlugin(runtimeConfig: RuntimeConfig) {
  const virtualModuleId = 'virtual:nuxt-runtime-config'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export const runtimeConfig = ${JSON.stringify(runtimeConfig)};`
      }
    },
    name: 'nuxt-runtime-config', // Required, will show up in warnings and errors
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
  }
}
