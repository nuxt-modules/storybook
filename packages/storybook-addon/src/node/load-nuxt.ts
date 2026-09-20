import { resolve } from 'pathe'
import type { Nuxt, ViteConfig as NuxtViteConfig } from '@nuxt/schema'
import type { UserConfig as ViteConfig } from 'vite'
import { runtimeDir } from '../dirs'

interface LoadedNuxt {
   nuxt: Nuxt
   viteConfig: ViteConfig
}

export async function loadNuxtViteConfig(
  root: string | undefined,
): Promise<LoadedNuxt> {
  const { buildNuxt, loadNuxt } = await import('@nuxt/kit')

  const nuxt = await loadNuxt({
    cwd: root,
    dev: false,
    overrides: {
      appId: 'nuxt-app',
      buildId: 'storybook',
      experimental: {
        appManifest: false,
      },
      pages: true,
      ssr: false,
    },
    ready: false,
  })

  if (nuxt.options.builder !== '@nuxt/vite-builder') {
    throw new Error(
      // oxlint-disable-next-line typescript/restrict-template-expressions, typescript/no-base-to-string -- builder is a string union type, so it should be safe to use in template literal
      `Storybook-Nuxt does not support '${nuxt.options.builder}' for now.`,
    )
  }

  nuxt.options.build.transpile.push(runtimeDir)

  nuxt.hook('pages:routerOptions', ({ files }) => {
    files.push({ path: resolve(runtimeDir, 'router.options') })
  })

  await nuxt.ready()

  const viteConfig = await captureClientViteConfig(nuxt, buildNuxt)
  return { nuxt, viteConfig }
}

function asViteConfig(config: Readonly<NuxtViteConfig>): ViteConfig {
  return config as unknown as ViteConfig
}
 
function captureClientViteConfig(
  nuxt: Nuxt,
  buildNuxt: (nuxt: Nuxt) => Promise<void>,
): Promise<ViteConfig> {
  return new Promise<ViteConfig>((done, reject) => {
    nuxt.hook('vite:configResolved', (config, { isClient }) => {
      if (isClient) {
        done(asViteConfig(config))
        // Stop the build process, as we don't need to build the Nuxt app
        throw new Error('_stop_')
      }
    })

    buildNuxt(nuxt).catch((error: unknown) => {
      if (!String(error).includes('_stop_')) {
        reject(error)
      }
    })
  }).finally(() => nuxt.close())
}
