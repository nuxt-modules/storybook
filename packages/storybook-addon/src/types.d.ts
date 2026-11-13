import type { Endpoint } from './runtime/endpoints'
import type { StorybookConfig as StorybookConfigBase } from 'storybook/internal/types'
import type {
  Args,
  FrameworkOptions as FrameworkOptionsVue,
  Meta as MetaVue,
  Preview as PreviewVue,
  StoryFn as StoryFnVue,
  StoryObj as StoryObjVue,
} from '@storybook/vue3-vite'
import type { NuxtPayload } from 'nuxt/app'
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

export interface FrameworkOptions extends FrameworkOptionsVue {
  /**
   * The annotations of a story or a meta running story code, in the story
   * files calling `mockNuxtImport`. They run in the context of their story,
   * so the spies they use are the ones of their story.
   *
   * @default ['afterEach', 'beforeEach', 'loaders', 'play']
   */
  storyHooks?: string[]
}

interface StorybookConfigFramework {
  framework: FrameworkName | { name: FrameworkName; options: FrameworkOptions }
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
   * Endpoints answered from inside the preview for this story, keyed by URL.
   */
  endpoints?: Record<string, Endpoint>

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
  runtimeConfig?: DeepPartial<NonNullable<NuxtPayload['config']>>
}

export type Meta<TCmpOrArgs = Args> = MetaVue<TCmpOrArgs> & WithNuxtParameters

export type Preview = PreviewVue & WithNuxtParameters

export type StoryFn<TCmpOrArgs = Args> = StoryFnVue<TCmpOrArgs> &
  WithNuxtParameters

export type StoryObj<TMetaOrCmpOrArgs = Args> = StoryObjVue<TMetaOrCmpOrArgs> &
  WithNuxtParameters

type DeepPartial<T> =
  T extends Record<string, unknown> ? { [K in keyof T]?: DeepPartial<T[K]> } : T

/** Adds `parameters.nuxt` to the CSF3 annotations of `@storybook/vue3-vite`. */
interface WithNuxtParameters {
  parameters?: { nuxt?: NuxtParameters }
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
