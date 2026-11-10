import { defineNuxtModule } from '@nuxt/kit'
import { experimental_vitePlugin } from '@storybook/vite-plugin'
import defu from 'defu'
import { relative, resolve } from 'pathe'
import { joinURL, withTrailingSlash } from 'ufo'
import type { LogLevel } from './logger'
import { colors, logger } from './logger'

export type * from '@storybook-vue/nuxt'

export interface ModuleOptions {
  /**
   * The route where the Storybook application is served by the Nuxt dev server.
   *
   * @default '/_storybook'
   */
  route: string

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
  defaults: (nuxt) => ({
    enabled: true,
    logLevel: nuxt.options.logLevel === 'silent' ? 0 : 3,
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
  setup(options, nuxt) {
    if (!options.enabled) {
      return
    }

    logger.level = options.logLevel

    const configDir = resolve(nuxt.options.rootDir, '.storybook')
    nuxt.options.typescript = defu(nuxt.options.typescript, {
      tsConfig: {
        include: [relative(nuxt.options.buildDir, resolve(configDir, '**/*'))],
      },
    })

    if (!nuxt.options.dev) {
      return
    }

    logger.verbose('🔌  Storybook Module Setup')

    nuxt.hook('vite:extendConfig', (config, { isClient }) => {
      if (isClient) {
        config.plugins!.push(
          experimental_vitePlugin({ base: options.route, configDir }),
        )
      }
    })

    nuxt.hook('listen', (_server, listener) => {
      logger.log(
        `  ➜ Storybook: ${colors.underline(withTrailingSlash(joinURL(listener.url, options.route)))}`,
      )
    })

    nuxt.hook('devtools:customTabs', (tabs) => {
      tabs.push({
        icon: 'devicon:storybook',
        name: 'nuxt-storybook',
        title: 'Storybook',
        view: {
          src: withTrailingSlash(options.route),
          type: 'iframe',
        },
      })
    })
  },
})
