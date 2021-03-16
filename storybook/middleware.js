module.exports = function (app) {
  const addServerMiddleware = ({ prefix, handler }) => {
    app.use('/', handler)
  }

  /* <% if (Object.keys(options.proxy).length) { %> */
  try {
    const proxyModule = require('@nuxtjs/proxy')
    proxyModule.call({
      addServerMiddleware,
      nuxt: {
        options: {
          proxy: <%= devalue(options.proxy) %>,
          server: true
        }
      }
    })
  } catch (e) {
    console.error(`Cannot register proxy middleware -- ${e}`);
  }
  /* <% } %> */
}
