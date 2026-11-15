// https://nuxt.com/docs/api/configuration/nuxt-config
import ts from 'typescript'
import { DOCS_VERSIONS } from './shared/utils/docs-versions.ts'

export default defineNuxtConfig({
  compatibilityDate: '2024-07-11',

  hooks: {
    // The pages of a prefixed version link to their own version
    'content:file:afterParse'({ collection, content }) {
      const version = DOCS_VERSIONS.find(
        (candidate) => candidate.collection === collection.name,
      )
      if (version && version.prefix !== '/') {
        prefixLinks(content.body, version.prefix)
      }
    },
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
    // Before Nuxt Content, so code blocks marked `twoslash` show their types
    'nuxt-content-twoslash',
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

  twoslash: {
    // The module does not read the tsconfig Nuxt 5 generates, so set what the snippets need
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      strict: true,
      target: ts.ScriptTarget.ESNext,
    },
  },

  typescript: {
    // Nuxt Content only adds its collection types to the app tsconfig
    serverTsConfig: {
      include: ['./content/types.d.ts'],
    },
  },

  vue: {
    // Nuxt 5 turns it off, and the Twoslash popups (floating-vue) are written with the Options API
    optionsApi: true,
  },
})

// Walks the minimark body, where a node is `[tag, props, ...children]`: `['a', { href: '/storybook/config' }, 'Configuration']`
function prefixLinks(node: unknown, prefix: string): void {
  if (typeof node !== 'object' || node === null) {
    return
  }
  if (!Array.isArray(node)) {
    if ('value' in node) {
      prefixLinks(node.value, prefix)
    }
    return
  }
  const [tag, props] = node
  if (
    tag === 'a' &&
    typeof props === 'object' &&
    props !== null &&
    'href' in props &&
    typeof props.href === 'string' &&
    props.href.startsWith('/') &&
    !props.href.startsWith(`${prefix}/`)
  ) {
    props.href = `${prefix}${props.href}`
  }
  for (const child of node) {
    prefixLinks(child, prefix)
  }
}
