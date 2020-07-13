import path from 'path'
import fs from 'fs'
import vueOptions from '@storybook/vue/dist/server/options'
import { buildDev, buildStatic } from '@storybook/core/server'
import { requireMaybeEdge } from './utils'
import { StorybookOptions } from './types'
import { getWebpackConfig } from './webpack'

export async function build (options: StorybookOptions) {
  const buildOptions = await getStorybookConfig(options)
  buildStatic(buildOptions)
}
export async function start (options: StorybookOptions) {
  const buildOptions = await getStorybookConfig(options)
  buildDev(buildOptions)
}

async function getStorybookConfig (options: StorybookOptions) {
  const {
    nuxt,
    nuxtBuilder,
    nuxtWebpackConfig,
    nuxtStorybookConfig
  } = await buildNuxt(options)

  const userWebpackFinal = nuxtStorybookConfig.webpackFinal
  nuxtStorybookConfig.webpackFinal = (config, options) => {
    config = getWebpackConfig(config, options)
    if (typeof userWebpackFinal === 'function') {
      config = userWebpackFinal(config, options)
    }
    return config
  }

  return {
    ...vueOptions,
    packageJson: require('../package.json'),
    rootDir: options.rootDir,
    configDir: nuxtStorybookConfig.configDir,
    port: process.env.PORT || nuxtStorybookConfig.port || 3000,
    nuxt,
    nuxtBuilder,
    nuxtWebpackConfig,
    nuxtStorybookConfig,
    frameworkPresets: [
      ...vueOptions.frameworkPresets,
      require.resolve('./preset')
    ]
  }
}

async function buildNuxt (options: StorybookOptions) {
  const buildDir = path.resolve(options.rootDir, '.nuxt-storybook')
  const { loadNuxt, getBuilder } = requireMaybeEdge('nuxt')

  // Create new nuxt instance
  const nuxt = await loadNuxt({
    rootDir: options.rootDir,
    for: options.mode,
    configOverrides: {
      buildDir
    },
    transpile: [path.resolve(__dirname, '../storybook')]
  })

  // Create new builder
  const nuxtBuilder = await getBuilder(nuxt)

  // Load webpack config for Nuxt
  const { bundleBuilder } = nuxtBuilder

  const nuxtStorybookConfig = nuxt.options.storybook || {}
  // generate files
  nuxt.hook('build:before', async () => {
    const plugins = await nuxtBuilder.normalizePlugins()
    generateStorybookFiles.call(nuxt.moduleContainer, {
      ...nuxtStorybookConfig,
      plugins: plugins.filter(p => p.mode !== 'server'),
      styles: nuxt.options.css,
      store: nuxt.options.features.store ? nuxt.options.store : false,
      components: nuxt.options.components
    })
  })

  nuxtStorybookConfig.configDir = path.resolve(options.rootDir, 'storybook')
  if (!fs.existsSync(path.resolve(options.rootDir, 'storybook'))) {
    nuxtStorybookConfig.configDir = path.resolve(options.rootDir, '.nuxt-storybook', 'storybook')
  }
  // Mock webpack build as we only need generated templates
  nuxtBuilder.bundleBuilder = {
    build () { }
  }
  await nuxtBuilder.build()

  // It's important to call getWebpackConfig after bundler build
  const nuxtWebpackConfig = await bundleBuilder.getWebpackConfig('client')

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
