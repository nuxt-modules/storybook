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
        href: 'https://nuxt.com'
      },
      supabase: {
        label: 'Storybook',
        icon: 'simple-icons:storybook',
        href: 'https://storybook.js.org '
      }
    },
    header: {
      logo: true
    }
  }
})
