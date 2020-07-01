import Vue from 'vue'
import { configure } from '@storybook/vue'

/**
 * auto-import and register all components
 */
try {
  const components = require('../components/index.js')
  Object.keys(components).forEach(name => Vue.component(name, components[name]))
} catch (_e) {}

// TODO: implement components mock, like `nuxt-link`

/**
 * Importing Stories in here instead of `main.js` have benefit of hot reload
 */
configure([
  require.context('../../components', true, /\.stories\.js$/)
], module)
