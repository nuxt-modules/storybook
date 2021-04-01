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
  const nuxtFilteredEntries = [
    'webpack-hot-middleware',
    '.nuxt-storybook/client.js',
    'eventsource-polyfill'
  ]
  const storybookValidPlugins = [
    'VirtualModulesPlugin',
    'HtmlWebpackPlugin',
    'DefinePlugin' // Required because of https://storybook.js.org/docs/vue/configure/environment-variables
  ]
  config.entry = [
    ...extras.nuxtWebpackConfig.entry.app.filter(p => !nuxtFilteredEntries.some(np => p.includes(np))),
    ...(config.entry as string[])
  ]

  // @ts-ignore
  // replace entry point
  const modules = config.plugins.find(p => p.constructor.name === 'VirtualModulesPlugin')._staticModules
  Object.keys(modules).forEach((key) => {
    modules[key] = modules[key].replace(/@storybook\/vue/g, '~~/.nuxt-storybook/storybook/entry')
  })

  config.plugins = [
    ...config.plugins.filter(p => storybookValidPlugins.includes(p.constructor.name)),
    ...extras.nuxtWebpackConfig.plugins.filter(p => !nuxtFilteredPlugins.includes(p.constructor.name))
  ]
  const rules = config.module.rules
    .filter(rule => !/css|svg|mp/.test(rule.test?.toString()) && !/vue-loader/.test(String(rule.loader)))
  // Nuxt rules
  config.module.rules = [
    ...rules,
    ...extras.nuxtWebpackConfig.module.rules
  ]

  // Return the altered config
  return config
}
