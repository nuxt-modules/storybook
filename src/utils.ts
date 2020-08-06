import fsExtra from 'fs-extra'
import template from 'lodash/template'
import jiti from 'jiti'
import consola from 'consola'

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
      .replace('--', '')
      .replace(/-([a-z])/, v => v.replace('-', '').toUpperCase())
    acc[normalizedFlag] = flags[flag]
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
