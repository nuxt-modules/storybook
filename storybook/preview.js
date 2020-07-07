<% if (Array.isArray(options.css)) { %>// Import styles
<%= options.css.map(s => `import '${s}'`).join("\n") %>
<% } %>
import Vue from 'vue'
import { configure } from '@storybook/vue'
import { store, components } from '~storybook/plugins'
import '~storybook/mock'

Vue.use(store)
Vue.use(components)

/**
 * Importing Stories in here instead of `main.js` have benefit of hot reload
 */
configure([
  require.context('~/components', true, /\.stories\.js$/)
], module)
