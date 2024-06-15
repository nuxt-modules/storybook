export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  modules: ['@nuxtjs/plausible'],
  // Workaround for https://github.com/nuxt/nuxt/issues/27490
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
})
