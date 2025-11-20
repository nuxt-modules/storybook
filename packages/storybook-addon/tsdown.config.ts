import { defineConfig, type UserConfig } from 'tsdown'

const NODE_TARGET = 'node20.19' // Minimum Node version supported by Storybook 10

export default defineConfig(async () => {
  // reading the three types of entries from package.json, which has the following structure:
  // // {
  //  ...
  //   "bundler": {
  //     "managerEntries": ["./src/manager.ts"],
  //     "previewEntries": ["./src/preview.ts", "./src/index.ts"],
  //     "nodeEntries": ["./src/preset.ts"]
  //   }
  // }
  const packageJson = (
    await import('./package.json', { with: { type: 'json' } })
  ).default

  const {
    bundler: { managerEntries = [], previewEntries = [], nodeEntries = [] },
  } = packageJson

  const commonConfig: UserConfig = {
    format: ['esm'],
    treeshake: true,
    target: NODE_TARGET,
    // The following packages are provided by Storybook and should always be externalized
    // Meaning they shouldn't be bundled with the addon, and they shouldn't be regular dependencies either
    // external: ['react', 'react-dom', '@storybook/icons'],
    external: [
      'nuxt',
      'nuxt/schema',
      'nuxt/app',
      'vue',
      'ufo', // Provided by Nuxt at runtime
      'storybook/internal/types',
      '@vue/shared',
      '#app/composables/state',
      '#app/entry',
      '#build/plugins',
      '#build/css',
      'virtual:nuxt-runtime-config',
      '@storybook/builder-vite',
      '@storybook/vue3',
      '@storybook/vue3-vite',
    ],
    noExternal: ['vue-router', '@storybook-vue/nuxt'],
  }

  const configs: UserConfig[] = []

  // manager entries are entries meant to be loaded into the manager UI
  // they'll have manager-specific packages externalized and they won't be usable in node
  // they won't have types generated for them as they're usually loaded automatically by Storybook
  if (managerEntries.length) {
    configs.push({
      ...commonConfig,
      entry: managerEntries,
      platform: 'browser',
      target: 'esnext',
    })
  }

  // preview entries are entries meant to be loaded into the preview iframe
  // they'll have preview-specific packages externalized and they won't be usable in node
  // they'll have types generated for them so they can be imported when setting up Portable Stories
  if (previewEntries.length) {
    configs.push({
      ...commonConfig,
      entry: previewEntries,
      platform: 'browser',
      target: 'esnext', // we can use esnext for preview entries since Storybook will bundle the addon's preview entries again anyway
      dts: true,
    })
  }

  // node entries are entries meant to be used in node-only
  // this is useful for presets, which are loaded by Storybook when setting up configurations
  // they won't have types generated for them as they're usually loaded automatically by Storybook
  if (nodeEntries.length) {
    configs.push({
      ...commonConfig,
      entry: nodeEntries,
      platform: 'node',
      target: NODE_TARGET,
    })
  }

  // runtime entries are Nuxt runtime files used in the preview
  // they need to be built to dist/runtime/ to match the path references in preset.ts
  configs.push({
    ...commonConfig,
    entry: ['src/runtime/**/*.ts'],
    outDir: 'dist/runtime',
    platform: 'browser',
    target: 'esnext',
    dts: false,
  })

  return configs
})
