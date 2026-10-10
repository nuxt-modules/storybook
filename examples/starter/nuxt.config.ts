// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/storybook'],
  storybook: process.env.STORYBOOK_PORT
    ? { port: Number(process.env.STORYBOOK_PORT) }
    : {},
})
