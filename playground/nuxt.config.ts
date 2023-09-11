// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@invictus.codes/nuxt-vuetify',
    // '@storybook-vue/nuxt-storybook'
    '../src/module.ts'
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
  imports: {
    dirs: ['./stores'],
  }
})
