const proxyModule = require('@nuxtjs/proxy')

const proxy = { <%= Object.entries(options.proxy).map(([k, v]) => `'${k}': '${v}'`).join(", ") %> }

module.exports = function (app) {
  proxyModule.call({
    addServerMiddleware: ({ prefix, handler }) => {
      app.use('/', handler)
    },
    nuxt: { options: { proxy, server: true }
  }})
}
