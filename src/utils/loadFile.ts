import jiti from 'jiti'

export function loadFile (rootDir: string, file: string) {
  const config = jiti(rootDir)(file).default || {}

  return config.default || config
}
