// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/storybook', '@nuxt/image', '@pinia/nuxt', '@nuxtjs/i18n'],

  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },

  i18n: {
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
  },

  imports: {
    dirs: ['./stores'],
  },

  runtimeConfig: {
    // For testing runtimeConfig in useMyComposable
    app: {
      name: 'Nuxt',
      version: '1.0.0',
      baseURL: '/',
      host: 'localhost',
      port: 3000,
    },
  },

  compatibilityDate: '2024-08-03',
})
