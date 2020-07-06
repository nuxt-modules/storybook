import Vue from 'vue'
import { configure } from '@storybook/vue'
import { store, components } from './plugins'

Vue.use(store)
Vue.use(components)

// TODO: implement components mock, like `nuxt-link`

/**
 * Importing Stories in here instead of `main.js` have benefit of hot reload
 */
configure([
  require.context('~/components', true, /\.stories\.js$/)
], module)
