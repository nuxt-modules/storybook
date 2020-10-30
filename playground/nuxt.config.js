export default {
  components: true,
  css: [
    '~/assets/styles/main.scss'
  ],
  buildModules: [
    '@nuxtjs/fontawesome'
  ],
  modules: [
    '@nuxtjs/axios',
    "~/modules/included-module/index.js",
    "~/modules/excluded-module/index.js"
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
    addons: [],
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
    },
    // exclude stories / modules
    modules: {
      exclude: [
        "excluded-module"
      ]
    }
  }
}
