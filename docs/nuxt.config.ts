// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/fonts',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit',
  ],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://storybook.nuxtjs.org/',
  },

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      autoSubfolderIndex: false,
    },
  },

  icon: {
    provider: 'iconify',
  },

  llms: {
    domain: 'https://storybook.nuxtjs.org/',
    title: 'Storybook Nuxt Module - Documentation',
    description:
      'This is the documentation for the Storybook Nuxt Module, a module that allows you to easily integrate Storybook into your Nuxt project.',
    full: {
      title: 'Storybook Nuxt Module - Full Documentation',
      description:
        'This is the full documentation for the Storybook Nuxt Module.',
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' },
        ],
      },
      {
        title: 'Storybook',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/storybook%' },
        ],
      },
    ],
  },

  mcp: {
    name: 'Storybook Nuxt Module',
  },
})
