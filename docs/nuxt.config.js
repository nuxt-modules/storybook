import theme from '@nuxt/content-theme-docs'

export default theme({
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // https://github.com/bdrtsky/nuxt-ackee
    'nuxt-ackee'
  ],
  ackee: {
    server: 'https://ackee.nuxtjs.com',
    domainId: '7e54dba4-1702-4c2a-9fb4-e0657449fb95',
    detailed: true
  }
})
