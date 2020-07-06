
import { resolveRoot } from '../cli'

const jiti = require('jiti')(__dirname)

const config = loadFile(rootDir, './nuxt.config')

const storybook = config.storybook || {}

function _resolveRoot () {
  const args = arg({
  })
  const [_dir = '.'] = args._
  // Resolve dir
  const rootDir = path.resolve(process.cwd(), _dir)

  return rootDir
}

export function resolveRoot () {
  try {
    return _resolveRoot()
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}


export default {
  webpackFinal: storybook.webpackFinal,
  stories: storybook.stories,
  addons: storybook.addons
}
