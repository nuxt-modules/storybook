import * as webpack from 'webpack'
import { WebpackExtras } from './types'

export function getWebpackConfig (config: webpack.Configuration, extras: WebpackExtras): webpack.Configuration {
  // Chery-pick Nuxt plugins
  const NPlugins = [
    'WebpackBarPlugin',
    'DefinePlugin' // Provides process.env
  ]
  config.plugins.push(...extras.nuxtWebpackConfig.plugins.filter(p => NPlugins.includes(p.constructor.name)))
  config.plugins = config.plugins.filter(p => p.constructor.name !== 'ProgressPlugin')

  // Aliases
  config.resolve.alias = {
    ...extras.nuxtWebpackConfig.resolve.alias,
    ...config.resolve.alias,
    '~storybook': __dirname
  }

  // TODO: transpile __dirname

  // Return the altered config
  return config
}
