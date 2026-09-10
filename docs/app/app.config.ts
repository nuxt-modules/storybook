export default defineAppConfig({
  footer: {
    colorMode: false,
    credits: `Built with Nuxt UI • © ${new Date().getFullYear()}`,
    links: [
      {
        'aria-label': 'Nuxt Website',
        icon: 'i-simple-icons-nuxtdotjs',
        target: '_blank',
        to: 'https://nuxt.com',
      },
      {
        'aria-label': 'Storybook Website',
        icon: 'i-simple-icons-storybook',
        target: '_blank',
        to: 'https://storybook.js.org',
      },
    ],
  },
  header: {
    colorMode: true,
    links: [
      {
        'aria-label': 'Nuxt Storybook module on GitHub',
        icon: 'i-simple-icons-github',
        target: '_blank',
        to: 'https://github.com/nuxt-modules/storybook',
      },
    ],
    logo: {
      alt: '',
      dark: '',
      light: '',
    },
    search: true,
    title: '',
    to: '/',
  },
  seo: {
    siteName: 'Nuxt Storybook',
  },
  toc: {
    bottom: {
      edit: 'https://github.com/nuxt-modules/storybook/edit/main/docs/content',
      links: [
        {
          icon: 'i-lucide-star',
          label: 'Star on GitHub',
          target: '_blank',
          to: 'https://github.com/nuxt-modules/storybook',
        },
      ],
      title: 'Community',
    },
    title: 'Table of Contents',
  },
  ui: {
    colors: {
      neutral: 'slate',
      primary: 'french-rose',
    },
    footer: {
      slots: {
        left: 'text-sm text-muted',
        root: 'border-t border-default',
      },
    },
  },
})
