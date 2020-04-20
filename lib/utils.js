function getNuxt () {
  const nuxt = tryRequire('nuxt-edge') || tryRequire('nuxt')

  if (!nuxt) {
    throw new Error('Cannot find any nuxt version installed')
  }

  return nuxt
}

function tryRequire (pkg) {
  try {
    return require(pkg)
  } catch (_e) {}
}

module.exports = {
  getNuxt,
  tryRequire
}
