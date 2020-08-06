module.exports = {
  webpackFinal (config, options) {
    config = options.nuxtStorybookConfig.webpackFinal(config, options)
    // extend confi
    return config
  }<% if (Array.isArray(options.stories)) { %>,
  stories: [<%= options.stories.map(s => `'${s}'`).join(",") %>]<% } %><% if (Array.isArray(options.addons)) { %>,
  addons: [<%= options.addons.map(s => `'${s}'`).join(",") %>]<% } %>
}
