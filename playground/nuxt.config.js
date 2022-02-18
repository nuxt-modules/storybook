export default {
  components: true,
  css: [
    '~/assets/styles/main.scss'
  ],
  buildModules: [
    '@nuxtjs/fontawesome',
    '@nuxtjs/color-mode',
    '@nuxt/content'
  ],
  modules: [
    '@nuxtjs/axios',
    "~/modules/included-module/index.js",
    "~/modules/excluded-module/index.js"
  ],
  plugins: [
    '~/plugins/nop.server.js',
  ],
  fontawesome: {
    icons: {
      solid: true
    }
  },
  serverMiddleware: [
    { path: '/express', handler: '~/server/index.ts' },
    '~/server/object.ts',
    '~/server/function.ts',
  ],
  publicRuntimeConfig: {
    moduleName: "@nuxtjs/storybook",
  },
  axios: {
    proxy: true
  },
  proxy: {
    '/users': 'https://api.github.com',
  },
  storybook: {
    addons: [],
    stories: [
      '~/stories/**/*.stories.@(ts|js)'
    ],
    webpackFinal (config) {
      return config
    },
    decorators: ["<div><h1>Story with global decorator</h1><story/></div>"],
    parameters: {
      backgrounds: {
        default: 'white',
        values: [
          { name: 'white', value: '#ffffff' },
          { name: 'gray', value: '#aaaaaa' },
        ],
      },
    },
    // https://storybook.js.org/docs/react/essentials/toolbars-and-globals#global-types-and-the-toolbar-annotation
    globalTypes: {
      theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: 'light',
        toolbar: {
          icon: 'circlehollow',
          // array of plain string values or MenuItem shape (see below)
          items: ['light', 'dark'],
        },
      }
    },
    // exclude stories / modules
    modules: {
      exclude: [
        "excluded-module"
      ]
    }
  }
}
