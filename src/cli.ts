import path from 'path'
import fs from 'fs'
import arg from 'arg'

import { logger, normalizeFlags } from './utils'
import { eject, start, build } from './index'

export const usage = 'nuxt storybook [`dev`|`build`] [`dir`]'

function _run () {
  const args = arg({
    // Specify Nuxt config file
    '--config-file': String,
    '-c': '--config-file',
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
    '-h': '--host',
    '--force': Boolean,
    '--tsconfig': String
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
        ...normalizeFlags(flags)
      })
    case 'eject':
      return eject({
        rootDir,
        mode: 'dev',
        ...normalizeFlags(flags)
      })
    case 'dev':
      // Make sure NODE_ENV is `development`.
      // NOTE: While using `nuxt` to execute commands, Nuxt set NODE_ENV to `production` if it is missing.
      // https://github.com/nuxt/nuxt.js/blob/dev/packages/cli/src/setup.js#L9
      process.env.NODE_ENV = 'development'
      return start({
        rootDir,
        mode,
        ...normalizeFlags(flags)
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
