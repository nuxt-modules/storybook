import { resolve } from 'node:path'
import type { Nuxt } from 'nuxt/schema'
import { getPort } from 'get-port-please'
import type { ModuleOptions } from './module'
import { withTrailingSlash } from 'ufo'
import { colors, logger } from './logger'
import {
  cache as storybookCache,
  type PackageJson,
} from '@storybook/core-common'
import { buildDevStandalone, withTelemetry } from '@storybook/core-server'
import storybookPackageJson from '@storybook/core-server/package.json'

const buildLogger = logger.withTag('build')

function printError(error: {
  error?: Error
  stats?: { compilation?: { errors: Error[] } }
  close?: boolean
  compilation?: { errors: Error[] }
}) {
  if (error instanceof Error) {
    if (error.error) {
      buildLogger.error(error.error)
    } else if (error.stats?.compilation?.errors) {
      error.stats.compilation.errors.forEach((e) => buildLogger.log(e))
    } else {
      buildLogger.error(error)
    }
  } else if (error.compilation?.errors) {
    error.compilation.errors.forEach((e) => buildLogger.log(e))
  }

  buildLogger.warn(
    error.close
      ? `
          FATAL broken build!, will close the process,
          Fix the error below and restart storybook.
        `
      : `
          Broken build, fix the error above.
          You may need to refresh the browser.
        `,
  )
}

export async function setupStorybook(options: ModuleOptions, nuxt: Nuxt) {
  const storybookRoute = options.route
  const storybookServerPort = await getPort({
    ports: [options.port || 6006, 6007, 6008, 6009, 6010],
  })

  const projectDir = resolve(nuxt.options.rootDir)

  const storybookOptions = {
    port: storybookServerPort,
    configDir: resolve(projectDir, './.storybook'),
    configType: 'DEVELOPMENT',
    cache: storybookCache,
    packageJson: storybookPackageJson as PackageJson,
  } satisfies Parameters<typeof buildDevStandalone>[0]

  if (!nuxt.options.dev) return

  logger.verbose('Starting Storybook')
  const result = await withTelemetry(
    'dev',
    {
      cliOptions: {},
      presetOptions: {
        ...storybookOptions,
        corePresets: [],
        overridePresets: [],
      },
      printError,
    },
    () => buildDevStandalone(storybookOptions),
  )
  if (!result) {
    logger.error('Failed to start Storybook')
    return
  }
  logger.log(
    `  ➜ Storybook: ${colors.underline(withTrailingSlash(result.address))}`,
  )
  logger.verbose(
    `  ➜ Storybook: ${colors.underline(withTrailingSlash(result.networkAddress))}`,
  )

  nuxt.hook('build:done', () => {
    logger.verbose(' ')
    logger.verbose('✔ Storybook build done  ')
    logger.verbose('  ')
    // @ts-expect-error: officially import.meta.env is never undefined, but in practice it can be
    import.meta.env = import.meta.env || {}
    import.meta.env.__STORYBOOK__ = JSON.stringify(options)
  })

  nuxt.hook('devtools:customTabs', (tabs) => {
    tabs.push({
      // unique identifier
      name: 'nuxt-storybook',
      // title to display in the tab
      title: 'Storybook',
      // any icon from Iconify, or a URL to an image
      icon: 'devicon:storybook',
      // iframe view
      view: {
        type: 'iframe',
        // absolute URL to the iframes
        src: `${storybookRoute}/`,
      },
    })
  })
}
