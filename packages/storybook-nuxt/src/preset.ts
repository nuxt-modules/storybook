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

let nuxt: Nuxt

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
 * extend composables to override router ( fix undefined router  useNuxtApp )
 *
 * @param nuxt
 * */

async function extendComposables(nuxt: Nuxt) {
  const { addImportsSources } = await import(require.resolve('@nuxt/kit'))
  nuxt.options.build.transpile.push(composablesDir)
  addImportsSources({ imports: ['useRouter'], from: join(composablesDir, 'router') })
}

async function defineNuxtConfig(baseConfig: Record<string, any>) {
  const { loadNuxt, buildNuxt, addPlugin, extendPages } = await import(require.resolve('@nuxt/kit'))
  nuxt = await loadNuxt({
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
    // Add iframe page
    extendPages((pages: any) => {
      pages.push({
        name: 'storybook-iframe',
        path: '/iframe.html',
      })
    })

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
export const previewAnnotations: StorybookConfig['previewAnnotations'] = async (entry = []) => {
  return [...entry, resolve(packageDir, 'preview')]
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
    envPrefix: ['NUXT_'],
  })
}
