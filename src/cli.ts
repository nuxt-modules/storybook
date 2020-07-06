import path from 'path'
import arg from 'arg'
import { logger } from './utils'

import { start } from './index'

export const usage = 'nuxt storybook [`dir`] [`mode`]'

function _run () {
  const args = arg({
  })
  const [_dir = '.', mode = 'dev'] = args._
  // Resolve dir
  const rootDir = path.resolve(process.cwd(), _dir)

  switch (mode) {
    case 'build':
      return
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
