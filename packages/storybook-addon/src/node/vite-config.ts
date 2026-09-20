import replace from '@rollup/plugin-replace'
import vuePlugin from '@vitejs/plugin-vue'
import { resolvePath } from 'mlly'
import { normalize } from 'pathe'
import { mergeConfig, searchForWorkspaceRoot } from 'vite'
import type { Nuxt } from '@nuxt/schema'
import type { Plugin, UserConfig as ViteConfig } from 'vite'
import { servableDirs } from '../dirs'
import { previewOptionsPlugin } from './plugins/preview-options'

export async function mergeViteConfig(
  storybookConfig: ViteConfig,
  nuxtConfig: ViteConfig,
  nuxt: Nuxt,
): Promise<ViteConfig> {
  const extendedConfig: ViteConfig = mergeConfig(nuxtConfig, storybookConfig)

  const vueBundlerPath = await resolveVueBundlerPath(nuxt)
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
    // todo; will be removed in SB 12
    '@nuxtjs/storybook > @storybook-vue/nuxt > @storybook/vue3 > lodash/kebabCase',
    // Workaround for https://github.com/nuxt-modules/storybook/issues/776
    'storybook > @storybook/core > jsdoc-type-pratt-parser',
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
    server: {
      cors: true,
      fs: { allow: [searchForWorkspaceRoot(process.cwd()), ...servableDirs] },
    },
    envPrefix: ['NUXT_'],
  })
}

async function resolveVueBundlerPath(nuxt: Nuxt): Promise<string | undefined> {
  const path = await resolvePath('vue/dist/vue.esm-bundler.js', {
    url: [nuxt.options.rootDir, ...(nuxt.options.modulesDir ?? [])],
  }).catch(() => undefined)
  return path ? normalize(path) : undefined
}

// #1049 alias vue to absolute esm-bundler path
function vueBundlerAliasPlugin(vueBundlerPath: string): Plugin {
  return {
    name: 'nuxt-storybook:vue-bundler-alias',
    // nuxt set it in vite config
    enforce: 'post',
    config: () => ({ resolve: { alias: { vue: vueBundlerPath } } }),
  }
}
