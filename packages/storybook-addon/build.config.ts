import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  dependencies: [
    'vue-router',
    '@storybook/builder-vite',
    '@storybook/vue3',
    '@storybook/vue3-vite',
  ],
  entries: [
    { input: 'src/index' },
    { input: 'src/preview' },
    { ext: 'js', format: 'cjs', input: 'src/preset', outDir: 'dist/' },
    {
      ext: 'js',
      format: 'esm',
      input: 'src/runtime/',
      outDir: 'dist/runtime',
    },
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
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
