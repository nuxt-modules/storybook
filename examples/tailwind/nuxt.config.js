export default {
  components: true,
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],
  tailwindcss: {
    jit: true
  },
  storybook: {
    stories: [],
    webpackFinal (config) {
      return config
    }
  }
}
