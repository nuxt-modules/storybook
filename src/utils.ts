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
