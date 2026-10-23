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

  export const mockedImports: Record<string, Mock | undefined>
  export const mockedComponents: string[]
}
