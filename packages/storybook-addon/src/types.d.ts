import type { StorybookConfig as StorybookConfigBase } from 'storybook/internal/types'
import type { FrameworkOptions as FrameworkOptionsVue } from '@storybook/vue3-vite'
import type {
  BuilderOptions as BuilderOptionsVite,
  StorybookConfigVite,
} from '@storybook/builder-vite'

declare let STORYBOOK_VUE_GLOBAL_PLUGINS: string[]
declare let STORYBOOK_VUE_GLOBAL_MIXINS: string[]

type FrameworkName = '@storybook-vue/nuxt'
type BuilderName = '@storybook/builder-vite'

type BuilderOptions = BuilderOptionsVite & {
  outputDir?: string
}

interface StorybookConfigFramework {
  framework:
    | FrameworkName
    | { name: FrameworkName; options: FrameworkOptionsVue }
  core?: Omit<StorybookConfigBase['core'], 'builder'> & {
    builder?:
      | BuilderName
      | {
          name: BuilderName
          options?: BuilderOptions
        }
  }
}

export interface NuxtParameters {
  /**
   * Lets the story navigate away from its route, in the router or to another site.
   *
   * @default false
   * @remarks `false` keeps the story where it is and reports each attempt to the `navigation` spy.
   */
  navigation?: boolean

  /**
   * Route the story's Nuxt app starts on.
   *
   * @default '/'
   */
  route?: string

  /**
   * Values merged into the app's runtime config before the story's Nuxt app is created.
   */
  runtimeConfig?: Record<string, unknown>
}

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigVite | keyof StorybookConfigFramework
> &
  StorybookConfigVite &
  StorybookConfigFramework
