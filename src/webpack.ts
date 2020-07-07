import path from 'path'
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

  // Nuxt filtered rules
  const NuxtFilteredRules = [
    '.vue',
    '.css'
  ]

  config.module.rules = [
    ...config.module.rules,
    ...extras.nuxtWebpackConfig.module.rules.filter(r => !r.test || !NuxtFilteredRules.some(nr => r.test.test(nr)))
  ]

  // Aliases
  config.resolve.alias = {
    ...extras.nuxtWebpackConfig.resolve.alias,
    ...config.resolve.alias,
    '~storybook': path.resolve(__dirname, '../storybook')
  }

  // TODO: transpile __dirname

  // Return the altered config
  return config
}
