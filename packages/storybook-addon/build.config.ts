import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: 'src/index' },
    { input: 'src/preset' },
    { input: 'src/preview' },
    { ext: 'js', format: 'esm', input: 'src/runtime/', outDir: 'dist/runtime' },
  ],
  externals: ['storybook/internal/types'],
  rollup: {
    emitCJS: false,
    inlineDependencies: ['@vitejs/plugin-vue', '@rolldown/pluginutils'],
  },
})
