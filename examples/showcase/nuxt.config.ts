// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/storybook', '@nuxt/image'],
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
  vue: {
    runtimeCompiler: true,
  },
})
