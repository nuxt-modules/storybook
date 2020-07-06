import path from 'path'
import vueOptions from '@storybook/vue/dist/server/options'
import { buildDev } from '@storybook/core/server'
// TODO: universal way to detect nuxt or nuxt-edge
import { loadNuxt, getBuilder } from 'nuxt-edge'
import { StorybookOptions } from './types'

export async function buildNuxt (options: StorybookOptions) {
  const buildDir = path.resolve(options.rootDir, '.nuxt-storybook')
  const nuxt = await loadNuxt({
    rootDir: options.rootDir,
    for: options.mode,
    configOverrides: {
      buildDir
    }
  })

  const nuxtBuilder = await getBuilder(nuxt)
  const { bundleBuilder } = nuxtBuilder
  // Load webpack config for Nuxt
  const nuxtWebpackConfig = await bundleBuilder.getWebpackConfig('client')

  // TODO: replace with generateRoutesAndFiles
  await nuxtBuilder.build()

  return {
    nuxtBuilder,
    nuxtWebpackConfig
  }
}

export async function start (options: StorybookOptions) {
  const configDir = path.resolve('.', 'storybook')
  const {
    nuxtBuilder,
    nuxtWebpackConfig
  } = await buildNuxt(options)

  const buildOptions = {
    ...vueOptions,
    rootDir: options.rootDir,
    configDir,
    nuxtBuilder,
    nuxtWebpackConfig,
    frameworkPresets: [
      ...vueOptions.frameworkPresets,
      path.resolve('./dist/presets')
    ]
  }

  buildDev(buildOptions)
}
