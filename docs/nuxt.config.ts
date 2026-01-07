// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
  ],

  fonts: {
    // Google is not working in China
    provider: 'bunny',
    priority: ['bunny', 'google'],
  },

  site: {
    url: 'https://storybook.nuxtjs.org/',
  },

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    externalVue: false,
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  icon: {
    provider: 'iconify',
  },

  llms: {
    domain: 'https://storybook.nuxtjs.org/',
    title: 'Storybook Nuxt Module - Documentation',
    description: 'Nuxt module for Storybook',
  },
})
