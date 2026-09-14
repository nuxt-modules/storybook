import { defineNuxtModule } from '@nuxt/kit'
import type { ViteConfig } from '@nuxt/schema'
import type { LogLevel } from './logger'
import { logger } from './logger'

import { setupStorybook } from './storybook'

export type * from '@storybook-vue/nuxt'

/**
 * Well-known key used to hand the client Vite config to
 * `@storybook-vue/nuxt`, which runs in this same process.
 */
const VITE_CONFIG_PROMISE = Symbol.for(
  '@storybook-vue/nuxt:vite-config-promise',
)

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
  defaults: (nuxt) => ({
    enabled: true,
    host: import.meta.env?.STORYBOOK_HOST || 'http://localhost',
    https: false,
    logLevel: nuxt.options.logLevel === 'silent' ? 0 : 3,
    port: 6006,
    route: '/_storybook',
  }),
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
  async setup(options, nuxt) {
    if (import.meta.env?.__STORYBOOK__ || !options.enabled) {
      return
    }

    logger.level = options.logLevel

    logger.verbose('🔌  Storybook Module Setup')

    const viteConfigPromise = new Promise<Readonly<ViteConfig>>((resolve) => {
      nuxt.hook('vite:configResolved', (config, { isClient }) => {
        if (isClient) resolve(config)
      })
    })
    ;(nuxt as unknown as Record<symbol, Promise<Readonly<ViteConfig>>>)[
      VITE_CONFIG_PROMISE
    ] = viteConfigPromise

    nuxt.hook('listen', () => {
      setupStorybook(options, nuxt).catch((error: unknown) => {
        logger.error('Failed to start Storybook', error)
      })
    })
  },
})
