// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',

  modules: [
    '../packages/nuxt-module/src/module',
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
  ],

  devtools: {
    enabled: true,
  },

  storybook: {
    host: 'http://localhost',
    port: 6006,
  },

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'French', file: 'fr.json' },
      { code: 'ar', name: 'Arabic', file: 'ar.json' },
    ],
  },

  routeRules: {
    '/': { prerender: true },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },
})
