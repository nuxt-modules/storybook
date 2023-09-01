import { addImportsDir, createResolver, defineNuxtModule, extendViteConfig, logger } from '@nuxt/kit'

import { setupStorybook } from './storybook'
import { getPort } from 'get-port-please'

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
    
    console.log(' devtools :', nuxt.options.devtools )
    if(process.env.__STORYBOOK__)
     return
   
    logger.info('Storybook Module Setup')
    logger.info('--  setup :', options)
    // Default runtimeConfig
    const STORYBOOK_ROUTE = options.storybookRoute || '/__storybook_route'
    const STORYBOOK_PORT =  await getPort({ ports: [options.port || 6006 , 6007, 6008, 6009, 6010]})
    const STORYBOOK_URL = 'http://localhost:'+ STORYBOOK_PORT

    
    options.port = STORYBOOK_PORT 
    process.env.__STORYBOOK__ = JSON.stringify( options ) 
    process.env.STORYBOOK_PORT = JSON.stringify(STORYBOOK_PORT)
  
    const { resolve } = createResolver(import.meta.url)
    
    nuxt.options.ssr = false
    // Transpile runtime
    const runtimeDir = resolve('./runtime')
    const composablesDir = resolve(runtimeDir, 'composables')
    nuxt.options.build.transpile.push(runtimeDir)
    // Add composables
    addImportsDir(resolve(runtimeDir, 'composables'))
        
    extendViteConfig((config) => {
      logger.info('  ')
      logger.info(`🔌  extendViteConfig : `)

      config.optimizeDeps ??=  {}
      config.optimizeDeps.include = config.optimizeDeps.include || []

      logger.info(`http://localhost:${STORYBOOK_PORT}`)

      nuxt.options.devtools = true
      
      config.server ??= {}
      config.server.proxy ??= {}
      config.server.proxy[STORYBOOK_ROUTE] = {
        target: `http://localhost:${STORYBOOK_PORT}/`,
        changeOrigin: true,
        followRedirects: true,
        secure: false,
        ws:true,
        rewrite: (path: string) => {
          console.log('---path :', path)
          console.log(
            `http://localhost:${STORYBOOK_PORT}`
          )
          const newpath =  path.replace(STORYBOOK_ROUTE, '')
          console.log('--->newpath :', newpath)
          return newpath
        },
        
      }
      config.server.proxy['/storybook-server-channel'] = {
        target: `http://localhost:${STORYBOOK_PORT}/storybook-server-channel`,
        changeOrigin: true,
        followRedirects: true,
        secure: false,
        ws:true,
      }

    })

    await setupStorybook(options, nuxt)
   
    logger.info('')
    logger.info('Options.devtools :',  nuxt.options.devtools,' STORYBOOK_URL :', STORYBOOK_URL)
    if (nuxt.options.devtools) {
      
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
            // absolute URL to the iframes
            src: `${STORYBOOK_URL}/?path=/docs/`,
          },
        })
      })

    }
  },
})
