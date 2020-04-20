#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const vueOptions = require('@storybook/vue/dist/server/options').default
const { buildDev } = require('@storybook/core/server')
const packageJson = require('../package.json')

// Resolve rootDir
let rootDir
if (fs.existsSync(process.argv[2])) {
  rootDir = process.argv.splice(2, 1)[0]
}
rootDir = path.resolve(process.cwd(), rootDir)

// Try to guess configDir
let configDir = path.resolve(rootDir, '.storybook')
if (!fs.existsSync(configDir)) { configDir = undefined }

const options = {
  ...vueOptions,
  packageJson,
  rootDir,
  configDir,
  frameworkPresets: [
    ...vueOptions.frameworkPresets,
    require.resolve('../lib/preset')
  ]
}

buildDev(options)
