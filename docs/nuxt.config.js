import theme from '@nuxt/content-theme-docs'

export default theme({
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  },
  loading: { color: '#ff4785' },
  buildModules: [
    'vue-plausible'
  ],
  plausible: {
    domain: 'storybook.nuxtjs.org'
  }
})
