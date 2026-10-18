declare module 'virtual:nuxt-storybook/options' {
  import type { RuntimeConfig } from '@nuxt/schema'

  export const runtimeConfig: RuntimeConfig
}

declare module '#build/plugins' {
  import type { ObjectPlugin, Plugin } from 'nuxt/app'

  const plugins: (Plugin & ObjectPlugin)[]
  export default plugins
}

declare module '#build/css' {}

declare module 'virtual:nuxt-storybook/mocked-imports' {
  import type { Mock } from 'storybook/test'

  /** The spies of the auto-imports named in `mockNuxtImport()` calls. */
  export const mockedImports: Record<string, Mock | undefined>
}

declare module '#app/components/injections' {
  import type { InjectionKey } from 'vue'
  import type { RouteLocationNormalizedLoaded } from 'vue-router'

  export const PageRouteSymbol: InjectionKey<RouteLocationNormalizedLoaded>
}

declare module '#app/nuxt' {
  import type { NuxtApp } from 'nuxt/app'

  interface NuxtAppContext {
    use(): NuxtApp
    tryUse(): NuxtApp | null
    set(instance: NuxtApp, replace?: boolean): void
    unset(): void
  }

  export function getNuxtAppCtx(id?: string): NuxtAppContext
}
