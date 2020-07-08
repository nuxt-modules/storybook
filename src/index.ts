import path from 'path'
import fs from 'fs'
import vueOptions from '@storybook/vue/dist/server/options'
import { buildDev } from '@storybook/core/server'
import { requireMaybeEdge } from './utils'
import { StorybookOptions } from './types'
import { getWebpackConfig } from './webpack'

export async function start (options: StorybookOptions) {
  const {
    nuxt,
    nuxtBuilder,
    nuxtWebpackConfig,
    nuxtStorybookConfig
  } = await buildNuxt(options)

  nuxtStorybookConfig.configDir = path.resolve(options.rootDir, '.nuxt-storybook', 'storybook')
  const userWebpackFinal = nuxtStorybookConfig.webpackFinal
  nuxtStorybookConfig.webpackFinal = (config, options) => {
    config = getWebpackConfig(config, options)
    if (typeof userWebpackFinal === 'function') {
      config = userWebpackFinal(config, options)
    }
    return config
  }

  const buildOptions = {
    ...vueOptions,
    packageJson: require('../package.json'),
    rootDir: options.rootDir,
    configDir: nuxtStorybookConfig.configDir,
    port: 3000,
    nuxt,
    nuxtBuilder,
    nuxtWebpackConfig,
    nuxtStorybookConfig,
    frameworkPresets: [
      ...vueOptions.frameworkPresets,
      require.resolve('./preset')
    ]
  }

  buildDev(buildOptions)
}

export async function buildNuxt (options: StorybookOptions) {
  const buildDir = path.resolve(options.rootDir, '.nuxt-storybook')
  const { loadNuxt, getBuilder } = requireMaybeEdge('nuxt')

  // Create new nuxt instance
  const nuxt = await loadNuxt({
    rootDir: options.rootDir,
    for: options.mode,
    configOverrides: {
      buildDir
    }
  })

  // Create new builder
  const nuxtBuilder = await getBuilder(nuxt)

  // Load webpack config for Nuxt
  const { bundleBuilder } = nuxtBuilder
  const nuxtWebpackConfig = await bundleBuilder.getWebpackConfig('client')

  const nuxtStorybookConfig = nuxt.options.storybook || {}
  if (!fs.existsSync(path.resolve(options.rootDir, 'storybook'))) {
    nuxt.hook('build:before', async () => {
      const plugins = await nuxtBuilder.normalizePlugins()
      generateStorybookFiles.call(nuxt.moduleContainer, {
        ...nuxtStorybookConfig,
        plugins: plugins.filter(p => p.mode !== 'server'),
        styles: nuxt.options.css
      })
    })
  }

  // Mock webpack build as we only need generated templates
  nuxtBuilder.bundleBuilder = {
    build () { }
  }
  await nuxtBuilder.build()

  return {
    nuxt,
    nuxtBuilder,
    nuxtWebpackConfig,
    nuxtStorybookConfig
  }
}

function generateStorybookFiles (options) {
  const templatesRoot = path.resolve(__dirname, '../storybook')
  this.addTemplate({
    src: path.resolve(templatesRoot, 'main.js'),
    fileName: path.join('storybook', 'main.js'),
    options
  })
  this.addTemplate({
    src: path.resolve(templatesRoot, 'preview.js'),
    fileName: path.join('storybook', 'preview.js'),
    options
  })
}
