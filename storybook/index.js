import './mock'
// helpers to fix windows path
// https://github.com/nuxt/nuxt.js/blob/1edac29eba1a621339105f5adef73d4c30388fee/packages/utils/src/resolve.js#L13
export const isWindows = process.platform.startsWith('win')

export const wp = function wp (p = '') {
  if (isWindows) {
    return p.replace(/\\/g, '\\\\')
  }
  return p
}
