const config = require('../../nuxt.config').default
const storybook = config.storybook || {}

module.exports = {
  webpackFinal: storybook.webpackFinal,
  stories: storybook.stories,
  addons: storybook.addons
}
