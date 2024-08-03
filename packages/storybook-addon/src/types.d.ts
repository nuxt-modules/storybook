import type { StorybookConfig as StorybookConfigBase } from '@storybook/types'
import type {
  Preview,
  StoryFn,
  StoryObj,
  VueRenderer,
  Meta,
  DecoratorFunction,
} from '@storybook/vue3'
import type { FrameworkOptions as FrameworkOptionsVue } from '@storybook/vue3-vite'
import type {
  StorybookConfigVite,
  BuilderOptions as BuilderOptionsVite,
} from '@storybook/builder-vite'

declare let STORYBOOK_VUE_GLOBAL_PLUGINS: string[]
declare let STORYBOOK_VUE_GLOBAL_MIXINS: string[]

type FrameworkName = '@storybook-vue/nuxt'
type BuilderName = '@storybook/builder-vite'

type BuilderOptions = BuilderOptionsVite & {
  outputDir?: string
}

type StorybookConfigFramework = {
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

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigVite | keyof StorybookConfigFramework
> &
  StorybookConfigVite &
  StorybookConfigFramework

export { Meta, StoryFn, StoryObj, Preview, VueRenderer, DecoratorFunction }
