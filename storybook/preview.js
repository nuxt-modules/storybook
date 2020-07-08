<% if (Array.isArray(options.css)) { %>// Import styles
<%= options.css.map(s => `import '${s}'`).join("\n") %>
<% } %>
import Vue from 'vue'
import { configure } from '@storybook/vue'
import { store, components } from '~storybook/plugins'
import '~storybook/mock'

Vue.use(store)
Vue.use(components)


/* Plugins */
<% options.plugins.forEach((plugin) => { %>import <%= plugin.name %> from '<%= plugin.name %>' // Source: <%= relativeToBuild(plugin.src) %> (mode: '<%= plugin.mode %>')
<% }) %>

const plugins = [<%= options.plugins.map(plugin => plugin.name).join(",") %>]
const inject = (name, impl) => { 
  Vue.prototype['$' + name] = impl
}
plugins.forEach(plugin => {
  if (typeof plugin === 'function') {
    plugin(Vue.prototype, inject)
  }
})

/**
 * Importing Stories in here instead of `main.js` have benefit of hot reload
 */
configure([
  require.context('~/components', true, /\.stories\.js$/)
], module)
