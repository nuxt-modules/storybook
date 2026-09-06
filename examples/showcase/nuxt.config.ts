// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-08-03',
  devtools: { enabled: true },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ar'],
  },
  imports: {
    dirs: ['./stores'],
  },
  modules: ['@nuxtjs/storybook', '@nuxt/image', '@pinia/nuxt', '@nuxtjs/i18n'],
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  runtimeConfig: {
    // For testing runtimeConfig in useMyComposable
    public: {
      appBaseURL: '/',
      appHost: 'localhost',
      appName: 'Nuxt',
      appPort: 3000,
      appVersion: '1.0.0',
    },
  },
})
