import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PresetProperty } from '@storybook/types'
import { type UserConfig as ViteConfig, mergeConfig, searchForWorkspaceRoot } from 'vite'
import type { Nuxt } from '@nuxt/schema'

import type { StorybookConfig } from './types'

const packageDir = resolve(fileURLToPath(
  import.meta.url), '../..')
const distDir = resolve(fileURLToPath(
  import.meta.url), '../..', 'dist')
const runtimeDir = resolve(distDir, 'runtime')
const pluginsDir = resolve(runtimeDir, 'plugins')
const componentsDir = resolve(runtimeDir, 'components')
const composablesDir = resolve(runtimeDir, 'composables')

const dirs = [distDir, packageDir, pluginsDir, componentsDir, composablesDir]

const logger = console
/**
 * extend nuxt-link component to use storybook router
 * @param nuxt
 */
function extendComponents(nuxt: Nuxt) {
  nuxt.hook('components:extend', (components: any) => {
    const nuxtLink = components.find(({ name }: any) => name === 'NuxtLink')
    nuxtLink.filePath = join(runtimeDir, 'components/nuxt-link')
    nuxtLink.shortPath = join(runtimeDir, 'components/nuxt-link')
    nuxt.options.build.transpile.push(nuxtLink.filePath)
  })
}

/**
 * extend routes to add  storybook-iframe page
 * @param nuxt
 */

function extendPages(nuxt: Nuxt) {
  nuxt.hook('pages:extend', (pages: any) => {
    logger.info(' storyboo-iframe :', pages.find(({ name }: any) => name === 'storybook-iframe'))
    // pages.push({
    //   name: 'storybook-iframe',
    //   path: '/iframe.html',
    //   redirect: '/__storybook_preview__',
    // })
  })
}

/**
 * extend composables to override router ( fix undefined router  useNuxtApp )
 *
 * @param nuxt
 * */

async function extendComposables(nuxt: Nuxt) {
  const { addImportsSources } = await import(require.resolve('@nuxt/kit'))
  nuxt.options.build.transpile.push(composablesDir)
  addImportsSources({ imports: ['useRouter'], from: join(composablesDir, 'router') })
}
/**
 *  Get devtools config from nuxt runtime config
 * @param nuxt
 * @returns
 */
export function getDevtoolsConfig(nuxt: Nuxt) {
  const devtools = nuxt.options.runtimeConfig.public.devtools as Record<string, any> || {}
  const port = devtools.port?.toString() ?? '12442'
  const route = '/__nuxt_devtools__/client'
  const proxy = {
    [route]:
    {
      target: `http://localhost:${port}${route}`,
      changeOrigin: true,
      secure: false,
      rewrite: (path: string) => path.replace(route, ''),
      ws: true,
    },
  }
  return {
    enabled: nuxt.options.devtools,
    port,
    route,
    proxy,
  }
}

async function defineNuxtConfig(baseConfig: Record<string, any>) {
  const { loadNuxt, buildNuxt, addPlugin } = await import(require.resolve('@nuxt/kit'))
  const nuxt: Nuxt = await loadNuxt({
    rootDir: baseConfig.root,
    ready: false,
    dev: false,
    overrides: {
      ssr: false,
      target: 'static',
      build: {
        ssr: false,
      },
    },
  })

  if ((nuxt.options.builder as string) !== '@nuxt/vite-builder')
    throw new Error(`Storybook-Nuxt does not support '${nuxt.options.builder}' for now.`)

  let extendedConfig: ViteConfig = {}

  nuxt.hook('modules:done', () => {
    extendComposables(nuxt)
    addPlugin({
      src: join(runtimeDir, 'plugins/storybook'),
      mode: 'client',
    })
    // Override nuxt-link component to use storybook router
    extendComponents(nuxt)
    extendPages(nuxt)

    nuxt.hook(
      'vite:extendConfig',
      (
        config: ViteConfig | PromiseLike<ViteConfig> | Record<string, any>,
        { isClient }: any,
      ) => {
        if (isClient)
          extendedConfig = mergeConfig(config, baseConfig)
      },
    )
  })

  await nuxt.ready()

  try {
    await buildNuxt(nuxt)

    nuxt.options.dev = true
    return {
      viteConfig: extendedConfig,
      nuxt,
    }
  }
  catch (e: any) {
    throw new Error(e)
  }
}
export const core: PresetProperty<'core', StorybookConfig> = async (config: any) => {
  return ({
    ...config,
    builder: '@storybook/builder-vite',
    renderer: '@storybook/vue3',
  })
}
/**
 *
 * @param entry preview entries
 * @returns preview entries with nuxt runtime
 */
export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = [], options) => {
  const preview = resolve(distDir, 'preview')
  logger.log('previewAnnotations preview:', preview)
  return [...entry, preview]
}

export const viteFinal: StorybookConfig['viteFinal'] = async (
  config: Record<string, any>,
  options: any,
) => {
  const getStorybookViteConfig = async (c: Record<string, any>, o: any) => {
    const { viteFinal: ViteFile } = await import(require.resolve(join('@storybook/vue3-vite', 'preset')))
    return ViteFile(c, o)
  }
  const nuxtConfig = await defineNuxtConfig(await getStorybookViteConfig(config, options))

  return mergeConfig(nuxtConfig.viteConfig, {
    build: { rollupOptions: { external: ['vue', 'vue-demi'] } },
    define: {
      __NUXT__: JSON.stringify({ config: nuxtConfig.nuxt.options.runtimeConfig }),
    },
    server: {
      fs: { allow: [searchForWorkspaceRoot(process.cwd()), ...dirs] },
    },
    preview: {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' },
    },
    envPrefix: ['NUXT_'],
  })
}
