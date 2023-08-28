import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Core
    { input: 'src/index' },
    // Preset
    { input: 'src/preset', outDir: 'dist/', format: 'esm', ext: 'js' },
    // Runtime dirs
    { input: 'src/preview', outDir: 'dist/', ext: 'js' },
    {
      input: 'src/runtime/', outDir: 'dist/runtime', format: 'esm', ext: 'js',
    },

  ],

  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },

  externals: [
    'nuxt/schema',
    'nuxt/app',
    '@storybook/types',
    '@storybook/vue3',
    '@vue/shared',
    '@unhead/vue',
    '@nuxt/devtools-kit',
    '#app/composables/state',

  ],
  failOnWarn: false,
})
