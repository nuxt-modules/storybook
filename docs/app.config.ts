export default defineAppConfig({
  docus: {
    title: 'Nuxt Storybook',
    description: 'Enable Storybook inside your Nuxt application in seconds.',
    image: 'https://storybook.nuxtjs.org/social-card.png',
    socials: {
      twitter: 'storybookjs',
      github: 'nuxt-modules/storybook',
      nuxt: {
        label: 'Nuxt',
        icon: 'simple-icons:nuxtdotjs',
        href: 'https://nuxt.com',
      },
      storybook: {
        label: 'Storybook',
        icon: 'simple-icons:storybook',
        href: 'https://storybook.js.org ',
      },
    },
    header: {
      logo: true,
    },
    github: {
      dir: 'docs/content',
      root: 'docs/content',
      edit: true,
      releases: true,
      owner: 'nuxt-modules',
      repo: 'storybook',
      branch: 'main',
    },
  },
  github: {
    owner: 'chakAs3',
    repo: 'storybook',
    branch: 'main',
  },
})
