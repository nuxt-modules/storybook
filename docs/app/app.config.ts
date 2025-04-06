export default defineAppConfig({
  ui: {
    colors: {
      primary: 'french-rose',
      neutral: 'slate',
    },
  },
  uiPro: {
    footer: {
      slots: {
        root: 'border-t border-(--ui-border)',
        left: 'text-sm text-(--ui-text-muted)',
      },
    },
  },
  seo: {
    siteName: 'Nuxt Storybook',
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: '',
      light: '',
      dark: '',
    },
    search: true,
    colorMode: true,
    links: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/nuxt-modules/storybook',
        target: '_blank',
        'aria-label': 'Nuxt Storybook module on GitHub',
      },
    ],
  },
  footer: {
    credits: 'Made with Nuxt UI Pro',
    colorMode: false,
    links: [
      {
        icon: 'i-simple-icons-nuxtdotjs',
        to: 'https://nuxt.com',
        target: '_blank',
        'aria-label': 'Nuxt Website',
      },
      {
        icon: 'i-simple-icons-storybook',
        to: 'https://storybook.js.org',
        target: '_blank',
        'aria-label': 'Storybook Website',
      },
    ],
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/nuxt-modules/storybook/edit/main/docs/content',
      links: [
        {
          icon: 'i-lucide-star',
          label: 'Star on GitHub',
          to: 'https://github.com/nuxt-modules/storybook',
          target: '_blank',
        },
      ],
    },
  },
})
