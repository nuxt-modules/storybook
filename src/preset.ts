import path from 'path'
import * as webpack from 'webpack'
import { WebpackExtras } from './types'

export default {
  webpackFinal (config: webpack.Configuration, extras: WebpackExtras): webpack.Configuration {
    // Aliases
    const buildDir = extras.nuxt.options.buildDir
    config.resolve.alias = {
      ...extras.nuxtWebpackConfig.resolve.alias,
      ...config.resolve.alias,
      '~storybook': path.resolve(__dirname, '../storybook'),
      // Nuxt plugins alias
      ...extras.nuxtBuilder.plugins.reduce((map, plugin) => ({ ...map, [plugin.name]: path.resolve(buildDir, plugin.src) }), {})
    }
    return config
  }
}
