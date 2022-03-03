import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: 'src/', outDir: 'dist', format: 'cjs', declaration: false }
  ],
  externals: [
    '@storybook/core'
  ]
})
