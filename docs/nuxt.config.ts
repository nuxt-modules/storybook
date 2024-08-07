// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxthq/studio',
    'nuxt-og-image',
  ],

  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter((c) =>
        ['UButton', 'UIcon'].includes(c.pascalName),
      )

      globals.forEach((c) => (c.global = true))
    },
  },

  ui: {
    icons: ['heroicons', 'simple-icons'],
  },

  uiPro: { license: 'oss' },

  colorMode: {
    disableTransition: true,
  },

  site: {
    url: 'https://storybook.nuxtjs.org/',
  },

  routeRules: {
    '/api/search.json': { prerender: true },
  },

  devtools: {
    enabled: true,
  },

  typescript: {
    strict: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  // Workaround for https://github.com/nuxt/content/issues/2688
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },

  compatibilityDate: '2024-08-03',
})
