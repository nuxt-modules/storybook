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
   * @default '/__storybook'
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
    storybookRoute: '/__storybook',
    port: 6006,
    version: 'v7',
    cookieName: 'sb_session',
    devtools: false,
  },
  setup(options, nuxt) {
    // Default runtimeConfig
    const STORYBOOK_URL = options.url || 'http://localhost:6006'
    const STORYBOOK_ROUTE = options.storybookRoute || '/__storybook'
    const STORYBOOK_PORT = options.port || 6006

    const { resolve } = createResolver(import.meta.url)

    nuxt.options.ssr = false

    // Transpile runtime
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    // Add composables
    addImportsDir(resolve(runtimeDir, 'composables'))

    extendViteConfig((config) => {
      config.optimizeDeps ??=  {}
      config.optimizeDeps.include = config.optimizeDeps.include || []

      config.server ??= {}
      config.server.proxy ??= {}
      config.server.proxy[STORYBOOK_ROUTE] = {
        target: `http://localhost:${STORYBOOK_PORT}${STORYBOOK_ROUTE}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path: string) => path.replace(STORYBOOK_ROUTE, ''),
      }
    })

    logger.info(`StorybookAdmin URL: ${STORYBOOK_URL}`)

    setupStorybook(nuxt)

    nuxt.hook('devtools:customTabs', (tabs) => {
      tabs.push({
        // unique identifier
        name: 'nuxt-storybook',
        // title to display in the tab
        title: 'Storybook',
        // any icon from Iconify, or a URL to an image
        icon: 'devicon:storybook',
        // iframe view
        view: {
          type: 'iframe',
          src: STORYBOOK_ROUTE,
        },
      })
    })
  },
})
