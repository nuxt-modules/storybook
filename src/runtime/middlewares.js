const middlewares = []

module.exports = {
  middlewares,
  addServerMiddleware: (middleware) => {
    middlewares.push(middleware)
  }
}
