export default {
  components: true,
  css: [
    '~/assets/styles/main.scss'
  ],
  buildModules: [
    '@nuxtjs/fontawesome'
  ],
  fontawesome: {
    icons: {
      solid: true
    }
  },
  storybook: {
    stories: [],
    webpackFinal (config) {
      return config
    }
  }
}
