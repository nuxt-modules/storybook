import path from 'path'
import fsExtra from 'fs-extra'
import upath from 'upath'
import vueOptions from '@storybook/vue/dist/cjs/server/options'
import { buildDev, buildStatic } from '@storybook/core/server'
import { requireMaybeEdge, compileTemplate, logger, ensureCoreJs3, requireTsNodeOrFail } from './utils'
import { StorybookOptions } from './types'
import { getWebpackConfig } from './webpack'
import middlewares from './runtime/middlewares'

export async function build (options: StorybookOptions) {
  const buildOptions = await getStorybookConfig(options)
  buildStatic(buildOptions)
}
export async function start (options: StorybookOptions) {
  const buildOptions = await getStorybookConfig(options)
  buildDev(buildOptions)
}

async function getStorybookConfig (options: StorybookOptions) {
  const {
    nuxt,
    nuxtBuilder,
    nuxtWebpackConfig,
    nuxtStorybookConfig
  } = await buildNuxt(options)

  nuxt.options.serverMiddleware.forEach((m) => {
    if (typeof m === 'string') {
      m = nuxt.resolver.resolvePath(m)
    }
    if (typeof m.handler === 'string') {
      m.handler = nuxt.resolver.resolvePath(m.handler)
    }
    middlewares.addServerMiddleware(m)
  })

  const userWebpackFinal = nuxtStorybookConfig.webpackFinal
  nuxtStorybookConfig.webpackFinal = (config, options) => {
    config = getWebpackConfig(config, options)
    if (typeof userWebpackFinal === 'function') {
      config = userWebpackFinal(config, options)
    }
    return config
  }

  if (!options.staticDir) {
    // Do not register static dir if it does not exists
    // https://github.com/nuxt-community/storybook/issues/263
    const staticDirPath = path.resolve(nuxt.options.srcDir, nuxt.options.dir.static)
    if (fsExtra.existsSync(staticDirPath)) {
      options.staticDir = staticDirPath
    }
  }
  const staticDir = (options.staticDir || '').split(',').map(dir => dir.trim()).filter(Boolean)

  return {
    ...vueOptions,
    packageJson: require('../package.json'),
    versionUpdates: false,
    rootDir: options.rootDir,
    configDir: nuxtStorybookConfig.configDir,
    port: parseInt(process.env.PORT_STORYBOOK || process.env.PORT || nuxtStorybookConfig.port || 3003, 10),
    nuxt,
    nuxtBuilder,
    nuxtWebpackConfig,
    nuxtStorybookConfig,
    ...options,
    staticDir,
    frameworkPresets: [
      require.resolve('./preset'),
      ...vueOptions.frameworkPresets
    ]
  }
}

async function buildNuxt (options: StorybookOptions) {
  ensureCoreJs3(options.rootDir)
  const buildDir = path.resolve(options.rootDir, '.nuxt-storybook')
  const { loadNuxt, getBuilder } = requireMaybeEdge('nuxt')

  const tsConfigPath = path.resolve(options.tsconfig || options.rootDir, options.tsconfig ? '' : 'tsconfig.json')
  if (fsExtra.existsSync(tsConfigPath)) {
    const tsNode = requireTsNodeOrFail()
    tsNode.register({
      project: tsConfigPath,
      compilerOptions: {
        module: 'commonjs'
      },
      transpileOnly: true
    })
  }

  // Create new nuxt instance
  const nuxt = await loadNuxt({
    ...options,
    rootDir: options.rootDir,
    for: options.mode,
    configOverrides: {
      ssr: false,
      buildDir,
      build: {
        corejs: '3',
        extractCSS: false,
        // https://github.com/nuxt-community/storybook/issues/102#issuecomment-704821377
        parallel: false
      },
      buildModules: [
        '@nuxt/postcss8'
      ]
    },
    transpile: [path.resolve(__dirname, '../storybook')]
  })

  // Create new builder
  const nuxtBuilder = await getBuilder(nuxt)

  // Load webpack config for Nuxt
  const { bundleBuilder } = nuxtBuilder

  const nuxtStorybookConfig = await nuxtStorybookOptions(nuxt, nuxt.options)

  // Transpile stories
  nuxt.options.build.transpile = [
    ...(nuxt.options.build.transpile || []),
    /.*\.stories\.js$/
  ]

  // generate files
  generateStorybookFiles.call(nuxt.moduleContainer, {
    ...nuxtStorybookConfig,
    nuxtOptions: nuxt.options,
    moduleDir: __dirname
  })

  // Mock webpack build as we only need generated templates
  nuxtBuilder.bundleBuilder = {
    build () { }
  }
  await nuxtBuilder.build()

  // It's important to call getWebpackConfig after bundler build
  const nuxtWebpackConfig = await bundleBuilder.getWebpackConfig('client')
  // Manually call `webpack:config` hook to extend config by modules
  await nuxt.callHook('webpack:config', [nuxtWebpackConfig])

  nuxt.hook('watch:restart', () => {
    nuxt.close()
    buildNuxt(options)
  })

  return {
    nuxt,
    nuxtBuilder,
    nuxtWebpackConfig,
    nuxtStorybookConfig
  }
}

function generateStorybookFiles (options) {
  const templatesRoot = path.resolve(__dirname, '../storybook')
  this.addTemplate({
    src: path.resolve(templatesRoot, 'main.js'),
    fileName: path.join('storybook', 'main.js'),
    options
  })
  this.addTemplate({
    src: path.resolve(templatesRoot, 'middleware.js'),
    fileName: path.join('storybook', 'middleware.js'),
    options
  })
  this.addTemplate({
    src: path.resolve(templatesRoot, 'preview.js'),
    fileName: path.join('storybook', 'preview.js'),
    options
  })
  this.addTemplate({
    src: path.resolve(templatesRoot, 'entry.js'),
    fileName: path.join('storybook', 'entry.js'),
    options
  })
  this.addTemplate({
    src: path.resolve(templatesRoot, 'nuxt-entry.js'),
    fileName: path.join('storybook', 'nuxt-entry.js'),
    options
  })
}

export function eject (options: StorybookOptions) {
  const configDir = path.resolve(options.rootDir, '.storybook')
  const templatesRoot = path.resolve(__dirname, '../storybook')
  if (!options.force && fsExtra.existsSync(configDir)) {
    logger.warn('Storybook is already ejected, use `--force` to overwrite files.')
    return
  }
  compileTemplate(path.resolve(templatesRoot, 'eject', 'main.js'), path.join(configDir, 'main.js'), {})
  compileTemplate(path.resolve(templatesRoot, 'eject', 'middleware.js'), path.join(configDir, 'middleware.js'), {})
  compileTemplate(path.resolve(templatesRoot, 'eject', 'preview.js'), path.join(configDir, 'preview.js'), {})
}

async function nuxtStorybookOptions (nuxt, options) {
  const nuxtStorybookConfig = Object.assign({
    stories: [],
    addons: [],
    decorators: [],
    parameters: {},
    globalTypes: {},
    modules: true
  }, options.storybook)

  nuxtStorybookConfig.configDir = path.resolve(options.rootDir, '.storybook')

  if (!fsExtra.existsSync(nuxtStorybookConfig.configDir)) {
    nuxtStorybookConfig.configDir = path.resolve(options.rootDir, '.nuxt-storybook', 'storybook')
  }

  let srcDir = options.srcDir || options.rootDir
  if (!srcDir.startsWith('/')) {
    srcDir = path.resolve(options.rootDir, srcDir)
  }

  const storiesDir = path.resolve(srcDir, 'components')
  if (fsExtra.existsSync(storiesDir)) {
    nuxtStorybookConfig.stories.unshift('~/components/**/*.stories.@(ts|js)')
  }

  // validate decorators
  if (nuxtStorybookConfig.decorators.find(decorator => typeof decorator !== 'string')) {
    logger.warn('Decorators inside `nuxt.config` should be simple template strings. Non-string decorators will be ignored.')

    nuxtStorybookConfig.decorators = nuxtStorybookConfig.decorators
      .filter(decorator => typeof decorator === 'string')
  }

  // ensure essential addon exists
  const essentials = nuxtStorybookConfig.addons
    .find(addon => addon === '@storybook/addon-essentials' || addon.name === '@storybook/addon-essentials')
  if (!essentials) {
    nuxtStorybookConfig.addons.unshift('@storybook/addon-essentials')
  }

  if (nuxtStorybookConfig.modules !== false) {
    const { exclude = [] } = nuxtStorybookConfig.modules
    await nuxt.callHook('storybook:config', nuxtStorybookConfig)

    nuxtStorybookConfig.stories = nuxtStorybookConfig.stories.filter(
      story => !exclude.some(e => story.match(e))
    )
  }

  nuxtStorybookConfig.stories = nuxtStorybookConfig.stories.map(story => upath.normalize(story
    .replace(/^~~/, path.relative(nuxtStorybookConfig.configDir, options.rootDir))
    .replace(/^~/, path.relative(nuxtStorybookConfig.configDir, srcDir)))
  )

  return nuxtStorybookConfig
}
