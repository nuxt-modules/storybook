import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { startSubprocess } from '@nuxt/devtools-kit'
import type { Nuxt } from 'nuxt/schema'
import { logger } from '@nuxt/kit'

export async function setupStorybook(nuxt: Nuxt) {
  const inited = await existsSync(resolve(nuxt.options.rootDir, '.storybook/main'))
  logger.log(' setupStorybook : ', nuxt.options.dev ? 'DevMode' : 'Prod', { inited })

  const projectDir = resolve(nuxt.options.rootDir)
  const args = inited ? 
              ['storybook', 'dev', '--port', '6006', '--ci'] : 
              ['storybook-nuxt', 'init', '--yes', '--force']

  if (!nuxt.options.dev)
    return
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
  nuxt.hook('close', () => _process.terminate())
}
