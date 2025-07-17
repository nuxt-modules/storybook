// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/storybook',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
  ],

  fonts: {
    families: [
      // { name: 'Roboto', provider: 'google' },
      // { name: 'Manufacturing Consent', provider: 'google' },
      // { name: 'Inter', provider: 'google' },
    ],
  },

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
