import path from 'path'
import vueOptions from '@storybook/vue/dist/server/options'
import { buildDev } from '@storybook/core/server'
import { requireMaybeEdge } from './utils'
import { StorybookOptions } from './types'

export async function start (options: StorybookOptions) {
  const configDir = path.resolve(options.rootDir, '.nuxt-storybook', 'storybook')

  const {
    // nuxt,
    nuxtBuilder,
    nuxtWebpackConfig
  } = await buildNuxt(options)

  const buildOptions = {
    ...vueOptions,
    packageJson: require('../package.json'),
    rootDir: options.rootDir,
    configDir,
    nuxtBuilder,
    nuxtWebpackConfig,
    frameworkPresets: [
      ...vueOptions.frameworkPresets,
      require.resolve('./preset')
      // TODO: Generate user preset from nuxt.config
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
  const templatesRoot = path.resolve(__dirname, '../storybook')

  // Generate storybook files
  nuxt.moduleContainer.addTemplate({
    src: path.resolve(templatesRoot, 'main.js'),
    fileName: path.join('storybook', 'main.js'),
    options: {}
  })
  nuxt.moduleContainer.addTemplate({
    src: path.resolve(templatesRoot, 'preview.js'),
    fileName: path.join('storybook', 'preview.js'),
    options: {}
  })

  // Create new builder
  const nuxtBuilder = await getBuilder(nuxt)

  // Load webpack config for Nuxt
  const { bundleBuilder } = nuxtBuilder
  const nuxtWebpackConfig = await bundleBuilder.getWebpackConfig('client')

  // Mock webpack build as we only need generated templates
  nuxtBuilder.bundleBuilder = {
    build () { }
  }
  await nuxtBuilder.build()

  return {
    nuxt,
    nuxtBuilder,
    nuxtWebpackConfig
  }
}
