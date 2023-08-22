// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    // '/Users/chakir/devs/devtools/local',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@pinia/nuxt',
    '@invictus.codes/nuxt-vuetify',
  ],
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
  },

})
