
const jiti = require('jiti')
const pick = require('lodash.pick')

const cli = require('../dist/cli')

const rootDir = cli.resolveRoot()
const config = jiti(rootDir)('./nuxt.config').default

module.exports = {
  ...pick(config.storybook, ['webpackFinal', 'stories', 'addons'])
}
