// import { resolve } from 'path'
import path from 'path'
import arg from 'arg'
// import destr from 'destr'
// import * as rc from 'rc9'
// import c from 'chalk'
import consola from './utils/log'
// import jiti from 'jiti'
// import env from 'std-env'
// import dotenv from 'dotenv'

import { start } from './storybook'

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
    consola.fatal(err)
    process.exit(1)
  }
}

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
    consola.fatal(err)
    process.exit(1)
  }
}

if (!module.parent) {
  run()
}
