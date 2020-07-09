export default {
  components: true,
  css: [
    '~/assets/styles/main.scss'
  ],
  buildModules: [
    '@nuxtjs/fontawesome'
  ],
  modules: [
    '@nuxtjs/axios'
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
