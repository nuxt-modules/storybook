import fsExtra from 'fs-extra'
import template from 'lodash/template'
import jiti from 'jiti'
import consola from 'consola'
import createRequire from 'create-require'

export const logger = consola.withScope('@nuxt/storybook')

export function loadFile (rootDir: string, file: string) {
  return jiti(rootDir)(file) || {}
}

export function tryRequire (pkg) {
  try {
    return require(pkg)
  } catch (_e) {}
}

export function requireMaybeEdge (pkg) {
  return tryRequire(pkg + '-edge') || tryRequire(pkg)
}

export function normalizeFlags (flags) {
  return Object.keys(flags).reduce((acc, flag) => {
    const normalizedFlag = flag
      .replace(/^--no-/, '')
      .replace('--', '')
      .replace(/-([a-z])/, v => v.replace('-', '').toUpperCase())
    acc[normalizedFlag] = flag.startsWith('--no-') ? !flags[flag] : flags[flag]
    return acc
  }, {})
}

export async function compileTemplate (src, destination, templateVars) {
  let content
  try {
    const fileContent = await fsExtra.readFile(src, 'utf8')

    const templateFunction = template(fileContent)
    content = templateFunction({
      options: templateVars
    })
  } catch (err) {
    throw new Error(`Could not compile template: ${err.message}`)
  }
  await fsExtra.outputFile(destination, content, 'utf8')
}

export function ensureCoreJs3 (rootDir) {
  const corejsVersion = Number.parseInt(createRequire(rootDir)('core-js/package.json').version.split('.')[0])
  if (corejsVersion < 3) {
    let nuxtVersion = ''
    try { nuxtVersion = (createRequire(rootDir)('nuxt/package.json').version) } catch {}
    try { nuxtVersion = (createRequire(rootDir)('nuxt-edge/package.json').version) } catch {}

    if (nuxtVersion.startsWith('2.14')) {
      logger.error('Storybook requires `core-js@3`. Run `yarn add --dev core-js@3 @babel/runtime-corejs3`')
    } else {
      logger.error('Storybook requires `core-js@3`. See https://github.com/nuxt/nuxt.js/tree/v2.13.3/packages/babel-preset-app#example-2-use-core-js3')
    }
    process.exit(1)
  }
}

export function requireTsNodeOrFail () {
  const tsNode = tryRequire('ts-node')
  if (!tsNode) {
    logger.error('Using Storybook within a Typescript project requires installing `ts-node`. Run `yarn add --dev ts-node`')
    process.exit(1)
  }
  return tsNode
}
