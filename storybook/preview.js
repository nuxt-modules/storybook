/* Styles */<% if (Array.isArray(options.styles)) { %>
<%= options.styles.map(s => `import '${s}'`).join("\n") %>
<% } %>
import Vue from 'vue'
import { configure } from '@storybook/vue'
import '~storybook/mock'
<% if (options.store) { %>import { createStore } from '~/.nuxt-storybook/store'<% } %>
<% if (options.components) { %>import * as components from '~/.nuxt-storybook/components'<% } %>
/* Plugins */
<% options.plugins.forEach((plugin) => { %>import <%= plugin.name %> from '<%= plugin.name %>' // Source: <%= relativeToBuild(plugin.src) %> (mode: '<%= plugin.mode %>')
<% }) %>

/* Components */
Object.keys(components).forEach(name => Vue.component(name, components[name]))


const inject = (name, impl) => { 
  Vue.prototype['$' + name] = impl
}
<% if (options.store) {%>inject('store', createStore({}))<% }%>
const plugins = [<%= options.plugins.map(plugin => plugin.name).join(",") %>].forEach(plugin => {
  if (typeof plugin === 'function') {
    plugin(Vue.prototype, inject)
  }
})

/**
 * Importing Stories in here instead of `main.js` have benefit of hot reload
 */
configure([
  require.context('~/components', true, /\.stories\.js$/),
  // Auto load modules storybook
  require.context('@nuxtjs', true, /\.stories\.js$/),
], module)
