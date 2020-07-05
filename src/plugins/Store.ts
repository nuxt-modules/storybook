export default {
  // The install method will be called with the Vue constructor as
  // the first argument, along with possible options
  install (Vue, options = {}) {
    try {
      const { createStore } = require('~/.nuxt-storybook/store')
      Vue.prototype.$store = createStore(options)
    } catch {}
  }
}
