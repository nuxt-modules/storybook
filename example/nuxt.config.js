export default {
  components: true,
  css: [
    '~/assets/styles/main.scss'
  ],
  storybook: {
    stories: [],
    webpackFinal (config) {
      return config
    }
  }
}
