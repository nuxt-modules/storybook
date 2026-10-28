import replace from '@rollup/plugin-replace'
import { resolvePath } from 'mlly'
import { dirname, normalize } from 'pathe'
import { mergeConfig, searchForWorkspaceRoot } from 'vite'
import type { Nuxt } from '@nuxt/schema'
import type { Plugin, UserConfig as ViteConfig } from 'vite'
import { browserIndex, servableDirs } from '../dirs'
import { previewOptionsPlugin } from './plugins/preview-options'

const PACKAGE_NAME_RE = /^@storybook-vue\/nuxt$/

const NITRO_PACKAGES = ['@nuxt/nitro-server', 'nitropack']

export async function mergeViteConfig(
  storybookConfig: ViteConfig,
  nuxtConfig: ViteConfig,
  nuxt: Nuxt,
): Promise<ViteConfig> {
  const extendedConfig: ViteConfig = mergeConfig(nuxtConfig, storybookConfig)

  const vueBundlerPath = await resolveVueBundlerPath(nuxt)
  const h3Path = await resolveH3Path(nuxt)
  if (!vueBundlerPath) {
    console.warn(
      'Could not resolve `vue/dist/vue.esm-bundler.js`, keeping the bare Storybook alias for `vue`',
    )
  }

  // Storybook adds 'vue' as dependency that should be optimized, but nuxt explicitly excludes it from pre-bundling
  // Prioritize `optimizeDeps.exclude`. If same dep is in `include` and `exclude`, remove it from `include`
  const { include = [], exclude } = extendedConfig.optimizeDeps ?? {}
  const optimizeInclude = include.filter((dep) => !exclude?.includes(dep))

  optimizeInclude.push(
    // Add lodash/kebabCase, since it is still a cjs module
    // Imported in https://github.com/storybookjs/storybook/blob/480359d5e340d97476131781c69b4b5e3b724f57/code/renderers/vue3/src/docs/sourceDecorator.ts#L18
    // Todo; will be removed in SB 12
    '@nuxtjs/storybook > @storybook-vue/nuxt > @storybook/vue3 > lodash/kebabCase',
  )

  extendedConfig.optimizeDeps = {
    ...extendedConfig.optimizeDeps,
    include: optimizeInclude,
    // Vite is optimizing too aggressively sometimes and missing components that are using virtual files like #components.
    noDiscovery: true,
  }

  return mergeConfig(extendedConfig, {
    define: {
      'import.meta.client': 'true',
      'import.meta.server': 'false',
    },
    envPrefix: ['NUXT_'],
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'import.meta.client': 'true',
          'import.meta.server': 'false',
        },
      }),
      previewOptionsPlugin({
        runtimeConfig: nuxt.options.runtimeConfig,
      }).vite(),
      ...(vueBundlerPath ? [vueBundlerAliasPlugin(vueBundlerPath)] : []),
    ],
    resolve: {
      alias: [
        { find: PACKAGE_NAME_RE, replacement: browserIndex },
        // Endpoint handlers and the stories share the project's h3, else the addon's
        ...(h3Path ? [{ find: /^h3$/, replacement: h3Path }] : []),
      ],
    },
    server: {
      cors: true,
      fs: { allow: [searchForWorkspaceRoot(process.cwd()), ...servableDirs] },
    },
  })
}

async function resolveVueBundlerPath(nuxt: Nuxt): Promise<string | undefined> {
  const path = await resolvePath('vue/dist/vue.esm-bundler.js', {
    url: [nuxt.options.rootDir, ...(nuxt.options.modulesDir ?? [])],
  }).catch(() => undefined)
  return path ? normalize(path) : undefined
}

// The project's h3, else the one of the nitro its Nuxt runs on
async function resolveH3Path(nuxt: Nuxt): Promise<string | undefined> {
  const urls = [nuxt.options.rootDir, ...(nuxt.options.modulesDir ?? [])]
  const h3Package =
    (await tryResolve('h3/package.json', urls)) ??
    (await resolveThroughNitro(urls))
  return h3Package ? normalize(dirname(h3Package)) : undefined
}

async function resolveThroughNitro(urls: string[]) {
  const nuxtPackage = await tryResolve('nuxt/package.json', urls)
  if (!nuxtPackage) {
    return undefined
  }
  const nitroPackages = await Promise.all(
    NITRO_PACKAGES.map((name) =>
      tryResolve(`${name}/package.json`, [dirname(nuxtPackage)]),
    ),
  )
  const nitroPackage = nitroPackages.find((path) => path !== undefined)
  return nitroPackage
    ? tryResolve('h3/package.json', [dirname(nitroPackage)])
    : undefined
}

function tryResolve(id: string, urls: string[]) {
  return resolvePath(id, { url: urls }).catch(() => undefined)
}

// #1049 alias vue to absolute esm-bundler path
function vueBundlerAliasPlugin(vueBundlerPath: string): Plugin {
  return {
    name: 'nuxt-storybook:vue-bundler-alias',
    // Nuxt set it in vite config
    enforce: 'post',
    config: () => ({ resolve: { alias: { vue: vueBundlerPath } } }),
  }
}
