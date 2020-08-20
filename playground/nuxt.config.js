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
  publicRuntimeConfig: {
    moduleName: "@nuxtjs/storybook",
  },
  storybook: {
    stories: [
      '~/stories/**/*.stories.@(ts|js)'
    ],
    webpackFinal (config) {
      return config
    }
  }
}
