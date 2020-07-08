module.exports = {
  webpackFinal(config, options) {
    return options.nuxtStorybookConfig.webpackFinal(config, options)
  },
<% if (Array.isArray(options.stories)) { %>
  stories: [<%= options.stories.map(s => `'${s}'`).join(",") %>],
<% } %>
<% if (Array.isArray(options.addons)) { %>
  addons: [<%= options.addons.map(s => `'${s}'`).join(",") %>],
<% } %>
}
