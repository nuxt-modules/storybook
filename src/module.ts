import { defineNuxtModule, logger } from '@nuxt/kit'

import { setupStorybook } from './storybook'

export interface ModuleOptions {
  /**
   * The route where the Storybook application will be available in development mode.
   *
   * @default '/_storybook'
   */
  route: string

  /**
   * The port where the Storybook application server will be started.
   *
   * @default 6006
   */
  port: number

  /**
   * The host where the Storybook application server will be started.
   *
   * @default Environment variable 'STORYBOOK_HOST' or 'http://localhost'
   * @example 'http://localhost'
   */
  host: string
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
    host: import.meta.env?.STORYBOOK_HOST || 'http://localhost:6006',
    route: '/_storybook',
    port: 6006,
  },
  async setup(options, nuxt) {
    
    if(import.meta.env?.__STORYBOOK__)
     return
   
    logger.info('🔌  Storybook Module Setup')
        
    setupStorybook(options, nuxt)
  },
})
