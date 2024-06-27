import { defineBuildConfig } from 'unbuild'
export default defineBuildConfig({
  externals: [
    // Workaround for https://github.com/sindresorhus/globby/issues/260
    'globby',
    // Esbuild cannot be bundled
    'esbuild',
  ],
  // Ignore warnings
  failOnWarn: false,
})
