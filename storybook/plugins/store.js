export default {
  install (Vue, options = {}) {
    try {
      const { createStore } = require('~/.nuxt-storybook/store')
      Vue.prototype.$store = createStore(options)
    } catch {}
  }
}
