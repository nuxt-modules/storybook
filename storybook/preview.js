import Vue from 'vue'
import { configure } from '@storybook/vue'
import { Store, Components } from '@nuxtjs/storybook/dist/plugins.esm'

Vue.use(Store)
Vue.use(Components)

// TODO: implement components mock, like `nuxt-link`

/**
 * Importing Stories in here instead of `main.js` have benefit of hot reload
 */
configure([
  require.context('~/components', true, /\.stories\.js$/)
], module)
