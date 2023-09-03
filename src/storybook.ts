import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { startSubprocess } from '@nuxt/devtools-kit'
import { logger } from '@nuxt/kit'
import { Nuxt } from 'nuxt/schema'
import { getPort } from 'get-port-please'
import { extendViteConfig } from '@nuxt/kit'


export async function setupStorybook(options: any, nuxt: Nuxt) {
  const STORYBOOK_ROUTE = options.storybookRoute || '/__storybook_route'
  const STORYBOOK_PORT =  await getPort({ ports: [options.port || 6006 , 6007, 6008, 6009, 6010]})
  const STORYBOOK_URL = 'http://localhost:'+ STORYBOOK_PORT
  
    
  options.port = STORYBOOK_PORT 
  process.env.__STORYBOOK__ = JSON.stringify( options ) 
  process.env.STORYBOOK_PORT = JSON.stringify(STORYBOOK_PORT)
  
  const projectDir = resolve(nuxt.options.rootDir)
  const args = isStorybookInstalled(projectDir) ? 
              ['storybook', 'dev', '--port',  `${STORYBOOK_PORT}`, '--ci'] : 
              ['storybook-nuxt@next', 'init']

  logger.info(' ')
  logger.info('📚  Starting Storybook  ') 
  logger.info('    Storybook args: ', args)  
  logger.info('')           

  if (!nuxt.options.dev)
    return

  nuxt.hook('app:resolve', async () => {
      logger.info(' ')
      const _process = startSubprocess(
        {
          command: 'npx',
          args,
          cwd: projectDir,
        },
        {
          id: 'nuxt-storybook-module:client',
          name: 'Nuxt Storybook Module Client Dev',
        },
        nuxt,
      )
      _process.getProcess().stdout?.pipe(process.stdout)
      _process.getProcess().stderr?.pipe(process.stderr)

      nuxt.hook('close', () => {
          logger.info('📚 Closing Storybook  ') 
          return _process.terminate()
        }
      )

      await new Promise(resolve => setTimeout(resolve, 2000))
      logger.info('📚 Storybook ready  ')
    } )

    const storybookProxy = {
      target: `http://localhost:${STORYBOOK_PORT}`,
      changeOrigin: true,
      followRedirects: true,
      secure: false,
      rewrite: (path: string) =>  path.replace(STORYBOOK_ROUTE, ''),
    }

    extendViteConfig((config) => {
      logger.info('  ')
      logger.info(`🔌  extendViteConfig : `)

      config.optimizeDeps ??=  {}
      config.optimizeDeps.include = config.optimizeDeps.include || []

      nuxt.options.devtools = true

      config.server ??= {}
      config.server.proxy ??= {}
      config.server.proxy[STORYBOOK_ROUTE] = storybookProxy
      config.server.proxy['/@vite/client'] = storybookProxy
      config.server.proxy['/virtual:/@storybook'] = storybookProxy
      config.server.proxy['/node_modules'] = storybookProxy
      config.server.proxy['/.storybook'] = storybookProxy
      config.server.proxy['/stories'] = storybookProxy
      config.server.proxy['/@id'] = storybookProxy
      config.server.proxy['/@fs'] = storybookProxy
      config.server.proxy['/app.vue'] = storybookProxy
      config.server.proxy['/.nuxt/app.config.mjs'] = storybookProxy
      config.server.proxy['/.nuxt/components/plugin.js'] = storybookProxy
      config.server.proxy['/components'] = storybookProxy
      config.server.proxy['/composables'] = storybookProxy
      config.server.proxy['/layouts'] = storybookProxy
      config.server.proxy['/pages'] = storybookProxy
      config.server.proxy['/storybook-server-channel'] = storybookProxy

  
    })

    nuxt.hook('build:done', () => {
      logger.info(' ')
      logger.info('📚  Storybook build done  ')
      logger.info('  ')
      nuxt.options.devtools = true
      // nuxt.callHook('devtools:initialized', () => {})
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
              src: `${STORYBOOK_ROUTE}/`,
            },
          })
        })
  
      }
    })

    logger.info('')
    logger.info(' devtools :',  nuxt.options.devtools,' STORYBOOK_URL :', STORYBOOK_URL)
   
  

}



function isStorybookInstalled(rootDir: string) {

   const isTypeScriptProject = existsSync(resolve(rootDir, 'tsconfig.json'))
   const configFileExtension = isTypeScriptProject ? 'ts' : 'js'
   const sbMain = existsSync(resolve(rootDir, `.storybook/main.${configFileExtension}`))
   
   return sbMain
}
