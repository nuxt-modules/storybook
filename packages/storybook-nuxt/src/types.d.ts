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
import type { StorybookConfigVite } from '@storybook/builder-vite'

declare let STORYBOOK_VUE_GLOBAL_PLUGINS: string[]
declare let STORYBOOK_VUE_GLOBAL_MIXINS: string[]

type FrameworkName = '@storybook-vue/nuxt'
type BuilderName = '@storybook/builder-vite'

export type FrameworkOptions = NuxtOptions & FrameworkOptionsVue

type StorybookConfigFramework = {
  framework: FrameworkName | { name: FrameworkName; options: FrameworkOptions }
  core?: StorybookConfigBase['core'] & { builder?: BuilderName }
  typescript?: StorybookConfigBase['typescript']
  previewAnnotations?: StorybookConfigBase['previewAnnotations']
  stories?: StorybookConfigBase['stories']
  addons?: StorybookConfigBase['addons']
  docs?: StorybookConfigBase['docs']
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

export interface NuxtOptions {}

export { Meta, StoryFn, StoryObj, Preview, VueRenderer, DecoratorFunction }
