import Vue from 'vue'
import { wp } from '~storybook';

/* Styles */<% if (Array.isArray(options.styles)) { %>
<%= options.styles.map(s => `import '${wp(s)}'`).join("\n") %>
<% } %>
import { normalizeError } from '~~/.nuxt-storybook/utils'
<% if (options.store) { %>import { createStore } from '~~/.nuxt-storybook/store'<% } %>
<% if (options.components) { %>import * as components from '~~/.nuxt-storybook/components';
Object.keys(components).forEach(name => Vue.component(name, components[name]))<% } %>
/* Plugins */
<% options.plugins.forEach((plugin) => { %>import <%= plugin.name %> from '<%= plugin.name %>' // Source: <%= relativeToBuild(plugin.src) %> (mode: '<%= plugin.mode %>')
<% }) %>


const inject = (name, impl) => {
  Vue.prototype['$' + name] = impl
}
<% if (options.store) {%>inject('store', createStore({}))<% }%>
Vue.prototype.app = {};<% /* prevent undefined app exception */ %>
[<%= options.plugins.map(plugin => plugin.name).join(",") %>].forEach(plugin => {
  if (typeof plugin === 'function') {
    try {
      plugin(Vue.prototype, inject)
    } catch (e) {
      console.error(normalizeError(e))<% /* warn plugin error */ %>
    }
  }
})
