
import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['storybook']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['storybook']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['storybook']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['storybook']?: ModuleOptions }
}


export { ModuleOptions, default } from './module'
