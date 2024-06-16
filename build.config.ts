import { defineBuildConfig } from 'unbuild'
export default defineBuildConfig({
  // Workaround for https://github.com/sindresorhus/globby/issues/260
  externals: ['globby'],
  // Ignore warnings
  failOnWarn: false,
})
