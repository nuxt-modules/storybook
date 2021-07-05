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
    'HtmlWebpackPlugin',
    'ESLintWebpackPlugin'
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

  // Temporary add `loose: true` into babel presets
  // This will fix on Storybook@v6.3 and should be remove after
  rules.forEach((rule) => {
    if (Array.isArray(rule.use)) {
      const loader: any = rule.use.find((u: any) => u.loader && String(u.loader).includes('babel-loader'))
      if (loader && loader.options && loader.options.presets && loader.options.presets[0] && loader.options.presets[0][1]) {
        loader.options.presets[0][1].loose = true
      }
    }
  })
  // Nuxt rules
  config.module.rules = [
    ...rules,
    ...extras.nuxtWebpackConfig.module.rules
  ]

  // Return the altered config
  return config
}
