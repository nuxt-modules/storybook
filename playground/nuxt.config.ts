// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    // Load the module from the built package (dist) rather than the raw
    // TypeScript source: the embedded Storybook startup hangs when the module
    // is loaded through jiti's TS transform, and users only ever get dist.
    // Run `pnpm build` before `pnpm dev` / the e2e suite (CI already does).
    '@nuxtjs/storybook',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
  ],

  storybook: {
    // Very verbose logs for debugging
    logLevel: Number.POSITIVE_INFINITY,
    // Let the e2e setup pin the embedded Storybook port so it cannot collide
    // with the standalone instance (see playwright.config.ts)
    ...(process.env.STORYBOOK_PORT
      ? { port: Number(process.env.STORYBOOK_PORT) }
      : {}),
  },

  i18n: {
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
  },
})
