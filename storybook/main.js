
const { loadFile } = require('../dist/utils/loadFile')

const cli = require('../dist/cli')

const rootDir = cli.resolveRoot()
const config = loadFile(rootDir, './nuxt.config')

const storybook = config.storybook || {}

module.exports = {
  webpackFinal: storybook.webpackFinal,
  stories: storybook.stories,
  addons: storybook.addons
}
