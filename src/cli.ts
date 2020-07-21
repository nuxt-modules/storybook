import path from 'path'
import arg from 'arg'
import { logger } from './utils'

import { start, build } from './index'

export const usage = 'nuxt storybook [`dev`|`build`] [`dir`]'

function _run () {
  const args = arg({})

  let [mode, _dir] = args._
  if (!_dir) {
    _dir = mode || '.'
    mode = 'dev'
  }
  // Resolve dir
  const rootDir = path.resolve(process.cwd(), _dir)

  switch (mode) {
    case 'build':
      return build({
        rootDir,
        mode
      })
    case 'dev':
    default:
      start({
        rootDir,
        mode
      })
  }
}

export function run () {
  try {
    _run()
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}

if (!module.parent) {
  run()
}
