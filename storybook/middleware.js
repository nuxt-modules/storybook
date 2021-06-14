const { middlewares } = require('../<%= relativeToBuild(options.moduleDir + "/runtime/middlewares.js") %>')
module.exports = function (app) {
  const addServerMiddleware = (middleware) => {
    // Directly use functions
    if (typeof middleware === 'function') {
      return app.use(middleware);
    }

    if (typeof middleware === 'string') {
      middleware = require(middleware)
      middleware = middleware.default || middleware
    }
    const { handler, handle, path, route } = middleware

    let _route = path || route || '/'
    _route = _route.startsWith('/') ? _route : `/${_route}`
    
    let _handler = handler || handle
    if (typeof _handler === 'string') {
      _handler = require(_handler)
      _handler = _handler.default || _handler
    }

    app.use(_route, _handler)
  }

  middlewares.forEach(m => addServerMiddleware(m))

}
