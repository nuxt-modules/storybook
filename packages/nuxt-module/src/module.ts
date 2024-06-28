import { defineNuxtModule } from '@nuxt/kit'
import type { LogLevel } from './logger'
import { logger } from './logger'

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

  /**
   * Log level for the terminal output.
   *
   * @default nuxt.options.logLevel
   */
  logLevel: LogLevel

  /**
   * Enable the module
   * @default true
   */
  enabled: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/storybook',
    configKey: 'storybook',
    compatibility: {
      nuxt: '>=3.0.0',
      builder: {
        // Not compatible with webpack
        webpack: false,
      },
    },
  },
  defaults: (nuxt) => ({
    host: import.meta.env?.STORYBOOK_HOST || 'http://localhost',
    route: '/_storybook',
    port: 6006,
    logLevel: nuxt.options.logLevel === 'silent' ? 0 : 3,
    enabled: true,
  }),
  async setup(options, nuxt) {
    if (import.meta.env?.__STORYBOOK__ || !options.enabled) return

    logger.level = options.logLevel

    logger.verbose('🔌  Storybook Module Setup')

    setupStorybook(options, nuxt)
  },
})
