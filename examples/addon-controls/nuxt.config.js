export default {
  components: true,
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],
  storybook: {
    stories: [],
    parameters: {
      viewMode: 'docs'
    },
    webpackFinal (config) {
      return config
    }
  }
}
