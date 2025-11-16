import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: 'src/index' },
    { input: 'src/preview' },
    { input: 'src/preset', outDir: 'dist/', format: 'cjs', ext: 'js' },
    { input: 'src/preset', outDir: 'dist/', format: 'esm', ext: 'mjs' },
    {
      input: 'src/runtime/',
      outDir: 'dist/runtime',
      format: 'esm',
      ext: 'js',
    },
  ],

  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  dependencies: [
    'vue-router',
    '@storybook/builder-vite',
    '@storybook/vue3',
    '@storybook/vue3-vite',
  ],
  externals: [
    'nuxt',
    'nuxt/schema',
    'nuxt/app',
    'vue',
    'storybook/internal/types',
    '@vue/shared',
    '#app/composables/state',
    '#app/entry',
    '#build/plugins',
    '#build/css',
    'virtual:nuxt-runtime-config',
    // Don't inline @storybook/vue3-vite so re-exports work properly
    '@storybook/vue3-vite',
    '@storybook/vue3-vite/preset',
  ],
})
