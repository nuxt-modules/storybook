import { addImportsDir, createResolver, defineNuxtModule, extendViteConfig, logger } from '@nuxt/kit'

import { setupStorybook } from './storybook'

export interface ModuleOptions {
  /**
   * StorybookAPI URL
   * @default process.env.STORYBOOK_URL
   * @example 'http://localhost:6006'
   * @type string
   */
  url?: string

  /**
   * StorybookVersion
   * @default 'v7'
   * @type string
   * @example 'v8'
   */
  version?: 'v7'

  /**
   * StorybookCookie Name
   * @default 'storybook_jwt'
   * @type string
  */
  cookieName?: string

  /**
   * Add Storybook  in Nuxt Devtools
   *
   * Please read the instructions on https://storybook.nuxtjs.org/devtools
   *
   * @default false
  */
  devtools?: boolean

  /**
   * Storybook Route
   * @default '/__storybook_route'
   */
  storybookRoute?: string

  /**
   * Storybook Port
   * @default 6006
   * @type number
   */
  port?: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@storybook-vue/nuxt-storybook',
    configKey: 'storybook',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    url: process.env.STORYBOOK_URL || 'http://localhost:6006',
    storybookRoute: '/__storybook_route',
    port: 6006,
    version: 'v7',
    cookieName: 'sb_session',
    devtools: false,
  },
  async setup(options, nuxt) {
    

    if(process.env.__STORYBOOK__)
     return
   
    logger.info('🔌  Storybook Module Setup')
    // Default runtimeConfig
  
    const { resolve } = createResolver(import.meta.url)
    
    nuxt.options.ssr = false
        
    setupStorybook(options, nuxt)
  },
})
