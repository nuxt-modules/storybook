export function tryRequire (pkg) {
  try {
    return require(pkg)
  } catch (_e) {}
}
