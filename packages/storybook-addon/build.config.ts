import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: 'src/index' },
    { input: 'src/preset' },
    { input: 'src/preview' },
    { ext: 'js', format: 'esm', input: 'src/runtime/', outDir: 'dist/runtime' },
  ],
  externals: [
    '#build/css',
    '#build/plugins',
    'nuxt/app',
    'storybook/internal/types',
    'virtual:nuxt-storybook/options',
    'vue',
  ],
  rollup: {
    emitCJS: false,
    inlineDependencies: ['@vitejs/plugin-vue', '@rolldown/pluginutils'],
  },
})
