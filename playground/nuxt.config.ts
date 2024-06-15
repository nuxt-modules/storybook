// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['../src/module'],
  storybook: {
    // Very verbose logs for debugging
    logLevel: Number.POSITIVE_INFINITY,
  },
  future: {
    compatibilityVersion: 4,
  },
})
