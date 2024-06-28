import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

import type { PresetProperty } from '@storybook/types'
import {
  type UserConfig as ViteConfig,
  mergeConfig,
  searchForWorkspaceRoot,
} from 'vite'
import type { Nuxt } from '@nuxt/schema'
import vuePlugin from '@vitejs/plugin-vue'

import replace from '@rollup/plugin-replace'
import type { StorybookConfig } from './types'
import { componentsDir, composablesDir, pluginsDir, runtimeDir } from './dirs'
import stringify from 'json-stable-stringify'
import nuxtRuntimeConfigPlugin from './runtimeConfig'

const packageDir = resolve(fileURLToPath(import.meta.url), '../..')
const distDir = resolve(fileURLToPath(import.meta.url), '../..', 'dist')

const dirs = [distDir, packageDir, pluginsDir, componentsDir]

/**
 * extend nuxt-link component to use storybook router
 * @param nuxt
 */
function extendComponents(nuxt: Nuxt) {
  nuxt.hook('components:extend', (components) => {
    const nuxtLink = components.find(
      ({ pascalName }) => pascalName === 'NuxtLink',
    )
    if (!nuxtLink) {
      throw new Error('NuxtLink component not found')
    }
    nuxtLink.filePath = join(runtimeDir, 'components/nuxt-link')
    nuxtLink.shortPath = join(runtimeDir, 'components/nuxt-link')
    nuxt.options.build.transpile.push(nuxtLink.filePath)
  })
}

/**
 * extend composables to override router ( fix undefined router  useNuxtApp )
 *
 * @param nuxt
 */

async function extendComposables(nuxt: Nuxt) {
  const { addImportsSources } = await import('@nuxt/kit')
  nuxt.options.build.transpile.push(composablesDir)
  addImportsSources({
    imports: ['useRouter'],
    from: join(composablesDir, 'router'),
  })
}

async function loadNuxtViteConfig(root: string | undefined) {
  const { loadNuxt, tryUseNuxt, buildNuxt, extendPages } = await import(
    '@nuxt/kit'
  )

  let nuxt = tryUseNuxt()
  if (nuxt) {
    // Nuxt is already started in the current process (i.e. in dev mode)
    // We assume that we are called from the Nuxt module, which means that
    // Nuxt is in the "load module" state and we can access the Vite config later via the hook
    const nuxtRes = nuxt
    return new Promise<{ viteConfig: ViteConfig; nuxt: Nuxt }>((resolve) => {
      nuxtRes.hook('vite:configResolved', (config, { isClient }) => {
        if (isClient) {
          resolve({
            viteConfig: config,
            nuxt: nuxtRes,
          })
        }
      })
    })
  }
  nuxt = await loadNuxt({
    cwd: root,
    ready: false,
    dev: false,
    overrides: {
      appId: 'nuxt-app',
      buildId: 'storybook',
      ssr: false,
    },
  })

  if ((nuxt.options.builder as string) !== '@nuxt/vite-builder')
    throw new Error(
      `Storybook-Nuxt does not support '${nuxt.options.builder}' for now.`,
    )
  nuxt.options.build.transpile.push(join(packageDir, 'preview'))

  nuxt.hook('modules:done', () => {
    extendComposables(nuxt)
    // Override nuxt-link component to use storybook router
    extendComponents(nuxt)
    // nuxt.options.build.transpile.push('@storybook-vue/nuxt')
    // Add iframe page
    extendPages((pages) => {
      pages.push({
        name: 'storybook-iframe',
        path: '/iframe.html',
      })
    })
  })

  // Get Vite config from Nuxt
  // https://nuxt.com/docs/api/kit/examples#accessing-nuxt-vite-config
  await nuxt.ready()
  return new Promise<{ viteConfig: ViteConfig; nuxt: Nuxt }>(
    (resolve, reject) => {
      nuxt.hook('vite:configResolved', (config, { isClient }) => {
        if (isClient) {
          resolve({
            viteConfig: config,
            nuxt,
          })
          // Stop the build process, as we don't need to build the Nuxt app
          throw new Error('_stop_')
        }
      })

      buildNuxt(nuxt).catch((err) => {
        if (!err.toString().includes('_stop_')) {
          reject(err)
        }
      })
    },
  ).finally(() => nuxt.close())
}

function mergeViteConfig(
  storybookConfig: ViteConfig,
  nuxtConfig: ViteConfig,
  nuxt: Nuxt,
): ViteConfig {
  const extendedConfig: ViteConfig = mergeConfig(nuxtConfig, storybookConfig)

  const plugins = extendedConfig.plugins || []

  // Find the index of the plugin with name 'vite:vue'
  const index = plugins.findIndex(
    (plugin) => plugin && 'name' in plugin && plugin.name === 'vite:vue',
  )

  // Check if the plugin was found
  if (index !== -1) {
    // Replace the plugin with the new one using vuePlugin()
    plugins[index] = vuePlugin()
  } else {
    // Vue plugin should be the first registered user plugin so that it will be added directly after Vite's core plugins
    // and transforms global vue components before nuxt:components:imports.
    plugins.unshift(vuePlugin())
  }

  extendedConfig.plugins = plugins
  // Storybook adds 'vue' as dependency that should be optimized, but nuxt explicitly excludes it from pre-bundling
  // Prioritize `optimizeDeps.exclude`. If same dep is in `include` and `exclude`, remove it from `include`
  extendedConfig.optimizeDeps!.include =
    extendedConfig.optimizeDeps!.include!.filter(
      (dep) => !extendedConfig.optimizeDeps!.exclude!.includes(dep),
    )
  return mergeConfig(extendedConfig, {
    // build: { rollupOptions: { external: ['vue', 'vue-demi'] } },
    define: {
      'import.meta.client': 'true',
    },

    plugins: [
      replace({
        values: {
          'import.meta.server': 'false',
          'import.meta.client': 'true',
        },
        preventAssignment: true,
      }),
      nuxtRuntimeConfigPlugin(nuxt.options.runtimeConfig),
    ],
    server: {
      cors: true,
      proxy: {
        ...getPreviewProxy(),
        ...getNuxtProxyConfig(nuxt).proxy,
      },
      fs: { allow: [searchForWorkspaceRoot(process.cwd()), ...dirs] },
    },
    envPrefix: ['NUXT_'],
  })
}

export const core: PresetProperty<'core', StorybookConfig> = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any,
) => {
  return {
    ...config,
    builder: '@storybook/builder-vite',
    renderer: '@storybook/vue3',
  }
}
/**
 * This is needed to correctly load the `preview.js` file,
 * see https://github.com/storybookjs/storybook/blob/main/docs/contribute/framework.md#4-author-the-framework-itself
 */
export const previewAnnotations: StorybookConfig['previewAnnotations'] = async (
  entry = [],
) => {
  return [...entry, resolve(packageDir, 'preview')]
}

export const viteFinal: StorybookConfig['viteFinal'] = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStorybookViteConfig = async (c: Record<string, any>, o: any) => {
    // const pkgPath = await getPackageDir('@storybook/vue3-vite')
    const presetURL = pathToFileURL(
      join(await getPackageDir('@storybook/vue3-vite'), 'preset.js'),
    )
    const { viteFinal: ViteFile } = await import(presetURL.href)

    if (!ViteFile) throw new Error('ViteFile not found')
    return ViteFile(c, o)
  }
  const storybookViteConfig = await getStorybookViteConfig(config, options)
  const { viteConfig: nuxtConfig, nuxt } = await loadNuxtViteConfig(
    storybookViteConfig.root,
  )
  const finalViteConfig = mergeViteConfig(config, nuxtConfig, nuxt)
  // Write all vite configs to logs
  const fs = await import('node:fs')
  fs.mkdirSync(join(options.outputDir, 'logs'), { recursive: true })
  fs.writeFileSync(
    join(options.outputDir, 'logs', 'vite-storybook.config.json'),
    stringify(storybookViteConfig, { space: '  ' }),
  )
  fs.writeFileSync(
    join(options.outputDir, 'logs', 'vite-nuxt.config.json'),
    stringify(nuxtConfig, { space: '  ' }),
  )
  fs.writeFileSync(
    join(options.outputDir, 'logs', 'vite-final.config.json'),
    stringify(finalViteConfig, { space: '  ' }),
  )

  return finalViteConfig
}

async function getPackageDir(frameworkPackageName: string) {
  //   const packageJsonPath = join(frameworkPackageName, 'package.json')

  try {
    const require = createRequire(import.meta.url)
    const packageDir = dirname(
      require.resolve(join(frameworkPackageName, 'package.json'), {
        paths: [process.cwd()],
      }),
    )

    return packageDir
  } catch (e) {
    // logger.error(e)
  }
  throw new Error(`Cannot find ${frameworkPackageName},`)
}

export function getNuxtProxyConfig(nuxt: Nuxt) {
  const port = nuxt.options.runtimeConfig.app.port ?? 3000
  const route = '^/(_nuxt|_ipx|_icon|__nuxt_devtools__)'
  const proxy = {
    [route]: {
      target: `http://localhost:${port}`,
      changeOrigin: true,
      secure: false,
      ws: true,
    },
  }
  return {
    port,
    route,
    proxy,
  }
}

function getPreviewProxy() {
  return {
    '/__storybook_preview__': {
      target: '/',
      changeOrigin: false,
      secure: false,
      rewrite: (path: string) => path.replace('/__storybook_preview__', ''),
      ws: true,
    },
  }
}
