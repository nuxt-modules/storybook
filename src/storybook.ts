import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { startSubprocess } from '@nuxt/devtools-kit'
import { logger } from '@nuxt/kit'
import { Nuxt } from 'nuxt/schema'


export async function setupStorybook(options: any, nuxt: Nuxt) {
 
  const projectDir = resolve(nuxt.options.rootDir)
  const args = isStorybookInstalled(projectDir) ? 
              ['storybook', 'dev', '--port',  options.port ?? '6006', '--ci'] : 
              ['storybook-nuxt@next', 'init']

  logger.info(' ')
  logger.info('📚  Starting Storybook  ') 
  logger.info('   Storybook args: ', args)  
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

      // await waitOn({
      //   resources: [options.url ?? 'http://localhost:'+(options.port ?? '6006')],
      //   timeout: 60_000,
      //   reverse: true,
      // })
  
      await new Promise(resolve => setTimeout(resolve, 2000))
      logger.info('📚 Storybook ready  ')
    } )
  

}



function isStorybookInstalled(rootDir: string) {

   const isTypeScriptProject = existsSync(resolve(rootDir, 'tsconfig.json'))
   const configFileExtension = isTypeScriptProject ? 'ts' : 'js'
   const sbMain = existsSync(resolve(rootDir, `.storybook/main.${configFileExtension}`))
   
   return sbMain
}
