import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { startSubprocess } from '@nuxt/devtools-kit'
import type { Nuxt } from 'nuxt/schema'
import { getPort } from 'get-port-please'
import { extendViteConfig, logger } from '@nuxt/kit'
import type { ModuleOptions } from './module'


export async function setupStorybook(options: ModuleOptions, nuxt: Nuxt) {
  const STORYBOOK_ROUTE = options.route
  const STORYBOOK_PORT =  await getPort({ ports: [options.port || 6006, 6007, 6008, 6009, 6010]})
  const STORYBOOK_HOST = options.host
  const STORYBOOK_URL = + STORYBOOK_HOST + STORYBOOK_PORT == 80 ? '' : `:${STORYBOOK_PORT}`
   
  const projectDir = resolve(nuxt.options.rootDir)
  const args = isStorybookConfigured(projectDir) ? 
              ['storybook', 'dev', '--port',  `${STORYBOOK_PORT}`, '--ci'] : 
              ['storybook-nuxt', 'init', '--start', '--port',  `${STORYBOOK_PORT}`, '--ci']

  logger.info(' ')
  logger.info( isStorybookConfigured(projectDir) ?
   '📚  Storybook is configured' : '📚  Storybook is not installed' )
  logger.info('')           

  if (!nuxt.options.dev)
    return

  nuxt.hook('app:resolve', async () => {

      const _process = startSubprocess(
        {
          command: 'npx',
          args,
          cwd: projectDir,
        },
        {
          id: 'nuxt-storybook-module:client',
          name: 'Storybook Server Terminal',
        },
        nuxt,
      )
      _process.getProcess().stdout?.pipe(process.stdout)
      _process.getProcess().stderr?.pipe(process.stderr)
      
      nuxt.hook('close', () => {
          logger.info(' ⚠️ Closing Storybook  ') 
          return _process.terminate()
        }
      )

      await new Promise(resolve => setTimeout(resolve, 2000))
      logger.info('ℹ️ Storybook ready  ')
    } )

    const storybookProxy = {
      target: STORYBOOK_URL,
      changeOrigin: true,
      followRedirects: true,
      secure: false,
      rewrite: (path: string) =>  path.replace(STORYBOOK_ROUTE, '')
    }


    extendViteConfig((config) => {
    
      config.optimizeDeps ??=  {}
      config.optimizeDeps.include = config.optimizeDeps.include || []

      config.server ??= {}
      config.server.proxy ??= {}

      config.server.proxy[STORYBOOK_ROUTE] = storybookProxy
      config.server.proxy['/@vite/client'] = storybookProxy
      config.server.proxy['/virtual:/@storybook'] = storybookProxy
      config.server.proxy['/node_modules'] = storybookProxy
      config.server.proxy['/.storybook'] = storybookProxy
      config.server.proxy['/stores'] = storybookProxy
    
      config.server.proxy['/stories'] = storybookProxy
      config.server.proxy['/assets'] = storybookProxy
      config.server.proxy['/@id'] = storybookProxy
      config.server.proxy['/@fs'] = storybookProxy
      config.server.proxy['/app.vue'] = storybookProxy
      config.server.proxy['/.nuxt'] = storybookProxy
      config.server.proxy['/app.config.mjs'] = storybookProxy

      config.server.proxy['/i18n.options.mjs'] = storybookProxy
      config.server.proxy['/i18n.config.ts'] = storybookProxy
      config.server.proxy['/components'] = storybookProxy
      config.server.proxy['/composables'] = storybookProxy
      config.server.proxy['/layouts'] = storybookProxy
      config.server.proxy['/pages'] = storybookProxy
      config.server.proxy['/storybook-server-channel'] = storybookProxy

      
    })
   
    nuxt.hook('build:done', () => {
      logger.info(' ')
      logger.info('✔ Storybook build done  ')
      logger.info('  ')
      import.meta.env.__STORYBOOK__ = JSON.stringify( options )     
    })
    
    logger.info('🔗 STORYBOOK_URL :', STORYBOOK_URL)
    
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
          src: `${STORYBOOK_ROUTE}/`,
        },
      })
    })
  

}

function isStorybookConfigured(rootDir: string) {

   const isTypeScriptProject = existsSync(resolve(rootDir, 'tsconfig.json'))
   const configFileExtension = isTypeScriptProject ? 'ts' : 'js'
   const sbMain = existsSync(resolve(rootDir, `.storybook/main.${configFileExtension}`))
   
   return sbMain
}
