export default {
  buildModules: ['@nuxt/components'],
  components: true,
  modules: [
    { handler: require('../') }
  ],
  storybook: {
  }
}
