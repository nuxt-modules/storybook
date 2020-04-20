async function getWebpackConfig (config, { rootDir, isDev } = {}) {
  const { getNuxt } = require('./utils')
  const { getWebpackConfig } = getNuxt('nuxt')

  // Load webpack config for Nuxt
  const nConfig = await getWebpackConfig('client', {
    rootDir,
    for: isDev ? 'dev' : 'build'
  })

  // Chery-pick Nuxt plugins
  const NPlugins = [
    'WebpackBarPlugin',
    'DefinePlugin' // Provides process.env
  ]
  config.plugins.push(...nConfig.plugins.filter(p => NPlugins.includes(p.constructor.name)))
  config.plugins = config.plugins.filter(p => p.constructor.name !== 'ProgressPlugin')

  // Aliases
  config.resolve.alias = {
    ...nConfig.resolve.alias,
    ...config.resolve.alias
  }

  // Return the altered config
  return config
}

module.exports = getWebpackConfig
