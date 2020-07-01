#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const vueOptions = require('@storybook/vue/dist/server/options').default
const { buildDev } = require('@storybook/core/server')
const { loadNuxt, getBuilder } = require('nuxt-edge')
const consola = require('consola')
const packageJson = require('../package.json')

async function main () {
  // Resolve rootDir
  let rootDir = '.'
  if (fs.existsSync(process.argv[2])) {
    rootDir = process.argv.splice(2, 1)[0]
  }
  rootDir = path.resolve(process.cwd(), rootDir)
  const nuxt = await loadNuxt({
    rootDir,
    for: 'build',

    // TODO: find better solution to support all versions of Nuxt
    configOverrides: {
      buildDir: path.resolve(rootDir, '.nuxt-storybook'),
      modules: [{ handler: require('../') }]
    }
  })

  const builder = await getBuilder(nuxt)
  const { bundleBuilder } = builder
  // Load webpack config for Nuxt
  const nuxtWebpackConfig = await bundleBuilder.getWebpackConfig('client')

  await builder.build()

  const options = {
    ...vueOptions,
    packageJson,
    rootDir,
    configDir: path.resolve(rootDir, '.nuxt-storybook', 'storybook'),
    nuxtWebpackConfig,
    frameworkPresets: [
      ...vueOptions.frameworkPresets
    ]
  }

  buildDev(options)
}

main().catch(consola.error)
