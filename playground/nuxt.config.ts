// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@pinia/nuxt',
    '@invictus.codes/nuxt-vuetify',
    // '@storybook-vue/nuxt-storybook'
    '../src/module.ts'
  ],
  storybook: {
    url: 'http://localhost:6006',
    port: 6006,
  },
  i18n: {
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
  },

  runtimeConfig: {
    app: {
      name: 'Nuxt',
      version: '1.0.0',
      baseURL: '/',
      host: 'localhost',
      port: 3000,
    },
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  imports: {
    dirs: ['./stores'],
  }
})
