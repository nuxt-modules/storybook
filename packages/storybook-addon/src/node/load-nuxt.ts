import { resolve } from 'pathe'
import type {
  Component,
  Nuxt,
  ViteConfig as NuxtViteConfig,
} from '@nuxt/schema'
import type { Import, Unimport } from 'unimport'
import type { UserConfig as ViteConfig } from 'vite'
import { runtimeDir } from '../dirs'

interface LoadedNuxt {
  components: Component[]
  /** The runtime auto-imports, modules' included. */
  imports: Import[]
  nuxt: Nuxt
  serverComponentRuntime: string
  viteConfig: ViteConfig
}

export async function loadNuxtViteConfig(
  root: string | undefined,
): Promise<LoadedNuxt> {
  const { buildNuxt, createResolver, loadNuxt } = await import('@nuxt/kit')

  const resolver = createResolver(runtimeDir)

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

  let unimport: Unimport | undefined
  nuxt.hook('imports:context', (context) => {
    unimport = context
  })

  let components: Component[] = []
  nuxt.hook('components:extend', (registered) => {
    components = registered
  })

  nuxt.hook('pages:routerOptions', ({ files }) => {
    files.push({ path: resolve(runtimeDir, 'router.options') })
  })

  nuxt.hook('pages:extend', async (pages) => {
    pages.push({
      file: await resolver.resolvePath(resolve(runtimeDir, 'fallback-page')),
      name: 'storybook-fallback',
      path: '/:pathMatch(.*)*',
    })
  })

  await nuxt.ready()
  if (!unimport) {
    throw new Error('[nuxt-storybook] Nuxt did not set up its auto-imports')
  }

  const viteConfig = await captureClientViteConfig(nuxt, buildNuxt)
  return {
    components,
    imports: await unimport.getImports(),
    nuxt,
    serverComponentRuntime: resolve(
      nuxt.options.appDir,
      '../components/runtime/server-component',
    ),
    viteConfig,
  }
}

function asViteConfig(config: Readonly<NuxtViteConfig>): ViteConfig {
  return config
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
