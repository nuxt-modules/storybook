import { defineNuxtModule, addVitePlugin } from '@nuxt/kit'
import componentHighlighterNuxt, {
  getNuxtViteDevToolsInjectionScript,
  viteDevToolsBridgeModule,
  getNuxtDevToolsHookScript,
} from '@storybook/experimental-devtools/nuxt'
export type * from '@storybook-vue/nuxt'

export interface ModuleOptions {
  /**
   * Enable the module
   * @default true
   */
  enabled: boolean

  // todo highlighter options
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    compatibility: {
      builder: {
        // Not compatible with webpack
        webpack: false,
      },
      nuxt: '^3.18.1 || ^4.0.0',
    },
    configKey: 'storybook',
    name: '@nuxtjs/storybook',
  },
  defaults: {
    enabled: true,
  },
  async setup(options, nuxt) {
    if (!nuxt.options.dev) {
      return
    }
    viteDevToolsBridgeModule({}, nuxt)
    nuxt.options.app.head = nuxt.options.app.head || {}
    nuxt.options.app.head.script = nuxt.options.app.head.script || []
    nuxt.options.app.head.script.push(
      {
        innerHTML: getNuxtDevToolsHookScript(),
        tagPosition: 'head',
      },
      {
        type: 'module',
        innerHTML: getNuxtViteDevToolsInjectionScript(),
        tagPosition: 'bodyClose',
      },
    )

    addVitePlugin(componentHighlighterNuxt())
  },
})
