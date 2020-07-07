export default {
  install (Vue) {
    /**
     * import and register all components
     */
    try {
      const components = require('~/.nuxt-storybook/components/index.js')
      Object.keys(components).forEach(name => Vue.component(name, components[name]))
    } catch (_e) {}
  }
}
