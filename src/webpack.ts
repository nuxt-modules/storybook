import path from 'path'
import * as webpack from 'webpack'
import { WebpackExtras } from './types'

// Config extends:
// - https://github.com/storybookjs/storybook/blob/master/lib/core/src/server/preview/base-webpack.config.js
// - https://github.com/storybookjs/storybook/blob/master/app/vue/src/server/framework-preset-vue.ts
export function getWebpackConfig (config: webpack.Configuration, extras: WebpackExtras): webpack.Configuration {
  // Merge Webpack plugins
  const nuxtFilteredPlugins = [
    'VueSSRClientPlugin',
    'ExtractCSS',
    // 'HotModuleReplacementPlugin',
    'HtmlWebpackPlugin'
  ]
  config.plugins = [
    config.plugins.find(p => p.constructor.name === 'HtmlWebpackPlugin'),
    ...extras.nuxtWebpackConfig.plugins.filter(p => !nuxtFilteredPlugins.some(np => p.constructor.name === np))
  ]

  // Nuxt rules
  config.module.rules = extras.nuxtWebpackConfig.module.rules

  // Aliases
  const buildDir = extras.nuxt.options.buildDir
  config.resolve.alias = {
    ...extras.nuxtWebpackConfig.resolve.alias,
    ...config.resolve.alias,
    '~storybook': path.resolve(__dirname, '../storybook'),
    // Nuxt plugins alias
    ...extras.nuxtBuilder.plugins.reduce((map, plugin) => ({ ...map, [plugin.name]: path.resolve(buildDir, plugin.src) }), {})
  }

  // TODO: transpile __dirname

  // Return the altered config
  return config
}
