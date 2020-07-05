import { tryRequire } from './tryRequire'

export function getNuxt () {
  const nuxt = tryRequire('nuxt-edge') || tryRequire('nuxt')

  if (!nuxt) {
    throw new Error('Cannot find any nuxt version installed')
  }

  return nuxt
}
