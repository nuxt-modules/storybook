const { middlewares } = require('../<%= relativeToBuild(options.moduleDir + "/runtime/middlewares.js") %>')
module.exports = function (app) {
  const addServerMiddleware = ({ handler, handle, route }) => {
    app.use(route || '/', handler || handle)
  }

  middlewares.forEach(m => addServerMiddleware(m))

}
