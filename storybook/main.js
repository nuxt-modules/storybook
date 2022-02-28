const stories = <%= JSON.stringify(options.stories) %>
const addons  = [<%= options.addons.map(s => devalue(s)).join(",") %>,{
  name: '@storybook/addon-postcss',
  options: {
    postcssLoaderOptions: {
      implementation: require('postcss')
    }
  }
}
]

function nuxifyStorybook(storybookConfig) {
  return {
    ...storybookConfig,
    webpackFinal(config, options) {
      if (options.nuxtStorybookConfig) {
        config = options.nuxtStorybookConfig.webpackFinal(config, options)
      }
      if (typeof storybookConfig.webpackFinal === 'function') {
        config = storybookConfig.webpackFinal(config, options)
      }
      return config
    },
    stories: [
      ...stories,
      ...storybookConfig.stories
    ],
    addons: [
      ...addons,
      ...storybookConfig.addons
    ],
  }
}

module.exports = {
  webpackFinal(config, options) {
    return options.nuxtStorybookConfig.webpackFinal(config, options)
  },
  stories,
  addons,
  nuxifyStorybook
}
