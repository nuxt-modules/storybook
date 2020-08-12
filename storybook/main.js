module.exports = {
  webpackFinal(config, options) {
    return options.nuxtStorybookConfig.webpackFinal(config, options)
  },<% if (options.stories.length) { %>
  stories: [<%= options.stories.map(s => `'${s}'`).join(",") %>],<% } %><% if (options.addons.length) { %>
  addons: [<%= options.addons.map(s => `'${s}'`).join(",") %>],<% } %>
}
