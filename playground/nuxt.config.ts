// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ar'],
  },
  modules: [
    // Built package, not the raw source: embedded startup hangs when the
    // module is loaded through jiti's TS transform. Needs `pnpm build` first.
    '@nuxtjs/storybook',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
    // Local: regression probe for #1072, see the module itself.
    './modules/stateful-vite-plugin-probe',
  ],
  storybook: {
    // Very verbose logs for debugging
    logLevel: Number.POSITIVE_INFINITY,
    // Lets the e2e setup pin the port so it cannot collide with the
    // standalone instance (see playwright.config.ts)
    ...(process.env.STORYBOOK_PORT
      ? { port: Number(process.env.STORYBOOK_PORT) }
      : {}),
  },
})
