// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['../packages/nuxt-module/src/module', '@nuxt/test-utils/module','@nuxtjs/i18n'],

  storybook: {
    // Very verbose logs for debugging
    logLevel: Number.POSITIVE_INFINITY,
  },
  i18n: {
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
  },

  compatibilityDate: '2024-08-03',
})
