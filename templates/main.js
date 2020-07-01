module.exports = {
  stories: [],
  webpackFinal: (config, { nuxtConfig }) => {
    // Chery-pick Nuxt plugins
    const NPlugins = [
      'WebpackBarPlugin',
      'DefinePlugin' // Provides process.env
    ]
    config.plugins.push(...nuxtConfig.plugins.filter(p => NPlugins.includes(p.constructor.name)))
    config.plugins = config.plugins.filter(p => p.constructor.name !== 'ProgressPlugin')

    // Aliases
    config.resolve.alias = {
      ...nuxtConfig.resolve.alias,
      ...config.resolve.alias
    }
    return config
  }
}
