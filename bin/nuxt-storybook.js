#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const vueOptions = require('@storybook/vue/dist/server/options').default
const { buildDev } = require('@storybook/core/server')
const { loadNuxt, getBuilder } = require('nuxt-edge')
const packageJson = require('../package.json')

// Resolve rootDir
let rootDir = '.'
if (fs.existsSync(process.argv[2])) {
  rootDir = process.argv.splice(2, 1)[0]
}
rootDir = path.resolve(process.cwd(), rootDir)

// Try to guess configDir
let configDir = path.resolve(rootDir, '.nuxt-storybook', 'storybook')
if (!fs.existsSync(configDir)) { configDir = undefined }

(async () => {
  const nuxt = await loadNuxt({
    rootDir,
    srcDir: rootDir,
    for: 'dev', // TODO: detect for

    // TODO: find better solution to support all versions of Nuxt
    configOverrides: {
      buildDir: path.resolve(rootDir, '.nuxt-storybook')
    }
  })

  const builder = await getBuilder(nuxt)
  const { bundleBuilder } = builder
  // Load webpack config for Nuxt
  const nuxtConfig = await bundleBuilder.getWebpackConfig('client')

  await builder.build()

  const options = {
    ...vueOptions,
    packageJson,
    rootDir,
    configDir,
    nuxtConfig,
    frameworkPresets: [
      ...vueOptions.frameworkPresets
    ]
  }

  buildDev(options)
})()
