import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: { emitCJS: true },

  failOnWarn: false,
})
