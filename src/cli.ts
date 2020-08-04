import path from 'path'
import fs from 'fs'
import arg from 'arg'
import { logger } from './utils'

import { start, build } from './index'

export const usage = 'nuxt storybook [`dev`|`build`] [`dir`]'

function _run () {
  const args = arg({
    '--static-dir': String,
    '-s': '--static-dir',
    '--output-dir': String,
    '-o': '--output-dir',
    '--quiet': Boolean,
    '--smoke-test': Boolean,
    '--ci': Boolean,
    '--port': Number,
    '-p': '--port',
    '--host': String,
    '-h': '--host'
  })
  const { _, ...flags } = args

  let [mode, _dir] = _
  if (!_dir && fs.existsSync(mode)) {
    _dir = mode || '.'
    mode = 'dev'
  } else {
    _dir = _dir || '.'
    mode = mode || 'dev'
  }
  // Resolve dir
  const rootDir = path.resolve(process.cwd(), _dir)

  switch (mode) {
    case 'build':
      return build({
        rootDir,
        mode,
        ...flags
      })
    case 'dev':
      return start({
        rootDir,
        mode,
        ...flags
      })
    default:
      logger.error(`Command "${mode}" not found`)
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
