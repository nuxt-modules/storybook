import { defineNuxtModule } from '@nuxt/kit'
import type { LogLevel } from './logger'
import { logger } from './logger'

import { setupStorybook } from './storybook'

export type * from '@storybook-vue/nuxt'

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

  /**
   * Whether to enable HTTPS.
   *
   * @default false
   *
   * @example
   * ```
   * https: {
   *   key: './server.key',
   *   cert: './server.crt'
   * }
   * ```
   */
  https: boolean | { key: string; cert: string }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/storybook',
    configKey: 'storybook',
    compatibility: {
      nuxt: '^3.18.1 || ^4.0.0',
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
    https: false,
  }),
  async setup(options, nuxt) {
    if (import.meta.env?.__STORYBOOK__ || !options.enabled) return

    logger.level = options.logLevel

    logger.verbose('🔌  Storybook Module Setup')

    // Capture the resolved client Vite config now, while modules are loading:
    // by the time Storybook starts (after the listen hook) the event may
    // already have fired, so @storybook-vue/nuxt cannot reliably register
    // this hook itself (#993).
    const viteConfigPromise = new Promise((resolve) => {
      nuxt.hook('vite:configResolved', (config, { isClient }) => {
        if (isClient) resolve(config)
      })
    })
    // Hand the promise to @storybook-vue/nuxt's loadNuxtViteConfig, which
    // runs in the same process and reads it off the shared Nuxt instance.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(nuxt as any)[Symbol.for('@storybook-vue/nuxt:vite-config-promise')] =
      viteConfigPromise

    // Defer Storybook startup until Nuxt's HTTP server is ready, but do not
    // await it: Nuxt's boot pipeline waits for listen-hook handlers, while
    // Storybook's preview build waits for the Vite config above — awaiting
    // here deadlocks both servers (#993).
    nuxt.hook('listen', () => {
      setupStorybook(options, nuxt).catch((err: unknown) => {
        logger.error('Failed to start Storybook', err)
      })
    })
  },
})
