
declare var  STORYBOOK_VUE_GLOBAL_PLUGINS: string[];
declare var  STORYBOOK_VUE_GLOBAL_MIXINS: string[];


import type { BuilderOptions, StorybookConfig as StorybookConfigBase } from '@storybook/types';
import type { Preview , StoryFn , StoryObj, VueRenderer, Meta, DecoratorFunction  } from '@storybook/vue3'

import { setup as addPluginSetup , render , decorateStory, renderToCanvas } from '@storybook/vue3'

type FrameworkName = '@storybook-vue/nuxt' | '@storybook-nuxt/framework';
type BuilderName = '@storybook/builder-vite';

export type FrameworkOptions = NuxtOptions & {
  builder?: BuilderOptions;
};

type StorybookConfigFramework = {
  framework: FrameworkName | { name: FrameworkName; options: FrameworkOptions}
  core?: StorybookConfigBase['core'] & { builder?: BuilderName  }  
  typescript?: StorybookConfigBase['typescript'];
  previewAnnotations?: StorybookConfigBase['previewAnnotations'];
  stories?: StorybookConfigBase['stories'];
  addons?: StorybookConfigBase['addons'];
  docs?: StorybookConfigBase['docs'];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = { viteFinal?:Record<string, any>  } & StorybookConfigFramework;

export interface NuxtOptions {
}

export { Meta, StoryFn, StoryObj, Preview, VueRenderer, addPluginSetup, DecoratorFunction, render, decorateStory, renderToCanvas }  