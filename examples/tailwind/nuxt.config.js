export default {
  components: true,
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],
  storybook: {
    stories: [],
    webpackFinal (config) {
      return config
    }
  }
}
