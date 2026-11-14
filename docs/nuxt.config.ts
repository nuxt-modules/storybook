// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-11',

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },

  css: ['~/assets/css/main.css'],

  devtools: {
    enabled: true,
  },

  experimental: {
    asyncContext: true,
  },

  icon: {
    provider: 'iconify',
  },

  llms: {
    description:
      'This is the documentation for the Storybook Nuxt Module, a module that allows you to easily integrate Storybook into your Nuxt project.',
    domain: 'https://storybook.nuxtjs.org/',
    full: {
      description:
        'This is the full documentation for the Storybook Nuxt Module.',
      title: 'Storybook Nuxt Module - Full Documentation',
    },
    sections: [
      {
        contentCollection: 'docsV10',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' },
        ],
        title: 'Getting Started',
      },
      {
        contentCollection: 'docsV10',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/storybook%' },
        ],
        title: 'Storybook',
      },
      {
        contentCollection: 'docsV11',
        title: 'Next version (v11)',
      },
    ],
    title: 'Storybook Nuxt Module - Documentation',
  },

  mcp: {
    name: 'Storybook Nuxt Module',
  },

  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/fonts',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit',
  ],

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      // The next version is only linked from the version switch menu
      routes: ['/', '/11.x/getting-started/setup'],
    },
  },

  site: {
    url: 'https://storybook.nuxtjs.org/',
  },
})
