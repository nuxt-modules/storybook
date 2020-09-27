module.exports = {
  webpackFinal(config, options) {
    return options.nuxtStorybookConfig.webpackFinal(config, options)
  },
  stories: [<%= options.stories.map(s => `'${s}'`).join(",") %>],
  addons:  [<%= options.addons.map(s => devalue(s)).join(",") %>]
}
