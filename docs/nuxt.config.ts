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
    // In the Vite environment build, the Nitro v2 compat of the modules resolves `h3/rules` to h3 v1
    nitroViteEnvironment: false,
  },

  // The docs server routes use Nitro v2 auto-imports (`useEvent`, `eventHandler`), without the h3 v1 shim
  nitroLegacy: { h3: false },

  icon: {
    provider: 'iconify',
  },

  llms: {
    // The docs serve their own `/raw/*.md` route, and Nuxt Content's one does not match on Nitro v3
    contentRawMarkdown: false,
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

  // OG images are all prerendered, so the server bundle needs no renderer
  ogImage: {
    zeroRuntime: true,
  },

  mcp: {
    name: 'Storybook Nuxt Module',
  },

  modules: [
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

  typescript: {
    // Nuxt Content only adds its collection types to the app tsconfig
    serverTsConfig: {
      include: ['./content/types.d.ts'],
    },
  },
})
