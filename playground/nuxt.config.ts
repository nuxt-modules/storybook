// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '../packages/nuxt-module/src/module',
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
  ],

  devtools: { enabled: true },

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2024-11-01',

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'French', file: 'fr.json' },
      { code: 'ar', name: 'Arabic', file: 'ar.json', dir: 'rtl' },
    ],
  },

  storybook: {
    host: 'http://localhost',
    port: 6006,
    // Very verbose logs for debugging
    logLevel: Number.POSITIVE_INFINITY,
  },
})
