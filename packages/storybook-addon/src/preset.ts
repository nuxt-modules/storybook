import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { resolve, normalize } from 'pathe'
import { resolvePath } from 'mlly'

import type {
  PresetProperty,
  PreviewAnnotation,
} from 'storybook/internal/types'
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
  extendedConfig.optimizeDeps = extendedConfig.optimizeDeps || {}
  extendedConfig.optimizeDeps.include =
    extendedConfig.optimizeDeps.include || []
  extendedConfig.optimizeDeps.include =
    extendedConfig.optimizeDeps.include.filter(
      (dep) => !extendedConfig.optimizeDeps?.exclude?.includes(dep),
    )

  extendedConfig.optimizeDeps.include.push(
    // Add lodash/kebabCase, since it is still a cjs module
    // Imported in https://github.com/storybookjs/storybook/blob/480359d5e340d97476131781c69b4b5e3b724f57/code/renderers/vue3/src/docs/sourceDecorator.ts#L18
    '@nuxtjs/storybook > @storybook-vue/nuxt > @storybook/vue3 > lodash/kebabCase',
    // Workaround for https://github.com/nuxt-modules/storybook/issues/776
    'storybook > @storybook/core > jsdoc-type-pratt-parser',
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
        // Only proxy to Nuxt dev server when Nuxt is actually running in dev mode
        ...(nuxt.options.dev ? getNuxtProxyConfig(nuxt).proxy : {}),
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
  // Import and extend core from @storybook/vue3-vite preset
  const presetURL = pathToFileURL(
    join(await getPackageDir('@storybook/vue3-vite'), 'preset.js'),
  )
  const vue3VitePreset = await import(presetURL.href)
  // core from vue3-vite is an object, not a function
  const baseCore = vue3VitePreset.core || {
    builder: '@storybook/builder-vite',
    renderer: '@storybook/vue3',
  }

  // Storybook 10+ is ESM-only, so we return package names and let Storybook
  // resolve them using its own ESM resolution. This works correctly with pnpm's
  // strict module resolution and avoids "Directory import is not supported" errors.
  return {
    ...baseCore,
    ...config,
  }
}

export interface Resolver {
  /**
   * Resolves the given path segments to an absolute path, using the provided base path.
   *
   * The resulting path is normalized, and trailing slashes are removed unless the path gets resolved to the root directory.
   *
   * @param path A sequence of paths or path segments.
   * @throws {TypeError} if any of the arguments is not a string.
   */
  resolve(...path: string[]): string
  /**
   * Asynchronously resolves a module path to a local file path, using the provided base path.
   *
   * @param id - The identifier or path of the module to resolve.
   * @returns A promise to resolve to the file path, or `null` if the module could not be resolved.
   */
  resolveModule(
    id: string,
    options?: { paths?: string[] },
  ): Promise<string | null>
}
/**
 * Creates a resolver that can resolve paths and modules relative to a base path.
 *
 * @example
 * ```js
 * const resolver = createResolver(import.meta.url)
 * const path = resolver.resolve('preview')
 * const modulePath = await resolver.resolveModule('module-name')
 * ```
 *
 * @param base - The base path to resolve paths and modules relative to.
 * @returns A resolver object.
 */
function createResolver(base: string | URL): Resolver {
  if (!base) {
    throw new Error('`base` argument is missing for createResolver(base)!')
  }

  base = base.toString()
  if (base.startsWith('file://')) {
    base = dirname(fileURLToPath(base))
  }

  return {
    resolve: (...path) => resolve(base, ...path),
    async resolveModule(id, options) {
      const paths = options?.paths ?? [base]
      paths.concat([base as string])
      return await resolvePath(id, { url: paths }).catch(() => null)
    },
  }
}

/**
 * This is needed to correctly load the `preview.js` file,
 * see https://github.com/storybookjs/storybook/blob/main/docs/contribute/framework.md#4-author-the-framework-itself
 */
export const previewAnnotations = async (
  entry: PreviewAnnotation[] = [],
): Promise<PreviewAnnotation[]> => {
  const resolver = createResolver(import.meta.url)

  // Problem: Storybook does not correctly resolve some modules to an absolute path to the correct deep path in node_modules.
  // Solution:
  // We need to make sure that they are resolved as dependencies of this package, since they are not installed in the root.
  // We need to use bare here otherwise storybook will strip the absolute path, leading to a wrong import
  // https://github.com/storybookjs/storybook/blob/3590a1cade2fe24608b3ce0246d5d58692c89883/code/builders/builder-vite/src/utils/process-preview-annotation.ts#L30-L35
  return [
    ...entry.map((entry) => {
      // Handle @storybook/vue3
      if (typeof entry === 'string' && entry.includes('vue3')) {
        return {
          bare: normalize(entry),
          absolute: '',
        }
      } else {
        return entry
      }
    }),
    {
      bare: resolver.resolve('preview'),
      absolute: '',
    },
  ]
}

export const viteFinal: StorybookConfig['viteFinal'] = async (
  config,
  options,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStorybookViteConfig = async (c: Record<string, any>, o: any) => {
    const presetURL = pathToFileURL(
      join(await getPackageDir('@storybook/vue3-vite'), 'preset.js'),
    )
    const { viteFinal: vueViteFinal } = await import(presetURL.href)

    if (!vueViteFinal) {
      throw new Error(
        'unexpected contents in package @storybook/vue3-vite: viteFinal not found',
      )
    }

    return (vueViteFinal as NonNullable<StorybookConfig['viteFinal']>)(c, o)
  }

  const storybookViteConfig = await getStorybookViteConfig(config, options)
  const { viteConfig: nuxtConfig, nuxt } = await loadNuxtViteConfig(
    storybookViteConfig.root,
  )

  const finalViteConfig = mergeViteConfig(storybookViteConfig, nuxtConfig, nuxt)

  if (options.outputDir != null) {
    // Write all vite configs to logs
    const fs = await import('node:fs')
    fs.mkdirSync(join(options.outputDir, 'logs'), { recursive: true })
    console.debug(`Writing Vite configs to ${options.outputDir}/logs/...`)
    fs.writeFileSync(
      join(options.outputDir, 'logs', 'vite-storybook.config.json'),
      stringify(storybookViteConfig, { space: '  ', cycles: true }) || '',
    )
    fs.writeFileSync(
      join(options.outputDir, 'logs', 'vite-nuxt.config.json'),
      stringify(nuxtConfig, { space: '  ', cycles: true }) || '',
    )
    fs.writeFileSync(
      join(options.outputDir, 'logs', 'vite-final.config.json'),
      stringify(finalViteConfig, { space: '  ', cycles: true }) || '',
    )
  }

  return finalViteConfig
}

async function getPackageDir(packageName: string) {
  try {
    const require = createRequire(import.meta.url)
    return dirname(require.resolve(join(packageName, 'package.json')))
  } catch (e) {
    throw new Error(`Cannot find ${packageName}`, { cause: e })
  }
}

export function getNuxtProxyConfig(nuxt: Nuxt) {
  const port = nuxt.options.runtimeConfig.app.port ?? 3000
  const route = '^/(_nuxt|_ipx|api/_nuxt_icon|__nuxt_devtools__|__nuxt_island)'
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
