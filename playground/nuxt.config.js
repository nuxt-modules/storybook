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
    addons: [
      {
        name: '@storybook/addon-essentials',
        options: {
          actions: false,
        }
      }
    ],
    stories: [
      '~/stories/**/*.stories.@(ts|js)'
    ],
    webpackFinal (config) {
      return config
    },
    parameters: {
      backgrounds: {
        default: 'white',
        values: [
          { name: 'white', value: '#ffffff' },
          { name: 'gray', value: '#aaaaaa' },
        ],
      },
    }
  }
}
