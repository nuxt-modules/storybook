// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ar'],
  },
  modules: [
    '../packages/nuxt-module/src/module',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
  ],
  storybook: {
    // Very verbose logs for debugging
    logLevel: Number.POSITIVE_INFINITY,
  },
})
