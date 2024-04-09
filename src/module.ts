import { defineNuxtModule, logger } from '@nuxt/kit'

import { setupStorybook } from './storybook'

export interface ModuleOptions {
  /**
   * StorybookAPI URL
   * @default import.meta.env.STORYBOOK_URL
   * @example 'http://localhost:6006'
   * @type string
   */
  url?: string

  /**
   * StorybookVersion
   * @default 'v8'
   * @type string
   * @example 'v8'
   */
  version?: 'v7' | 'v8'

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
    name: '@nuxtjs/storybook',
    configKey: 'storybook',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    url: import.meta.env.STORYBOOK_URL || 'http://localhost:6006',
    storybookRoute: '/__storybook_route',
    port: 6006,
    version: 'v8',
    cookieName: 'sb_session',
    devtools: false,
  },
  async setup(options, nuxt) {
    
    if(import.meta.env.__STORYBOOK__)
     return
   
    logger.info('🔌  Storybook Module Setup')
        
    setupStorybook(options, nuxt)
  },
})
