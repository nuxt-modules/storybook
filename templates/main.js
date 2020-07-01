module.exports = {
  stories: [],
  webpackFinal: (config, { nuxtWebpackConfig }) => {
    // Chery-pick Nuxt plugins
    const NPlugins = [
      'WebpackBarPlugin',
      'DefinePlugin' // Provides process.env
    ]
    config.plugins.push(...nuxtWebpackConfig.plugins.filter(p => NPlugins.includes(p.constructor.name)))
    config.plugins = config.plugins.filter(p => p.constructor.name !== 'ProgressPlugin')

    // Aliases
    config.resolve.alias = {
      ...nuxtWebpackConfig.resolve.alias,
      ...config.resolve.alias
    }
    return config
  }
}
