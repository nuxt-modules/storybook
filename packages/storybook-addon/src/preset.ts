import { fileURLToPath } from 'node:url'
import { normalize } from 'pathe'
import { viteFinal as vueViteFinal } from '@storybook/vue3-vite/preset'
import { mergeConfig } from 'vite'
import type { PresetProperty } from 'storybook/internal/types'
import { loadNuxtViteConfig } from './node/load-nuxt'
import {
  readMockedNames,
  resolveMockedComponents,
  resolveMockedImports,
} from './node/mock-calls'
import { mockComponentsPlugin } from './node/plugins/mock-components'
import { mockImportsPlugin } from './node/plugins/mock-imports'
import { storyFilesPlugin } from './node/plugins/story-files'
import { mergeViteConfig } from './node/vite-config'
import type { StorybookConfig } from './types.d'

export * from '@storybook/vue3-vite/preset'

/** Extensionless, so Vite picks the built `.mjs` next to this module. */
const PREVIEW_ENTRY = normalize(
  fileURLToPath(new URL('preview', import.meta.url)),
)

export const core: PresetProperty<'core'> = async (config, options) => {
  const framework = await options.presets.apply('framework')

  return {
    ...config,
    builder: {
      name: fileURLToPath(import.meta.resolve('@storybook/builder-vite')),
      options:
        typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: fileURLToPath(import.meta.resolve('@storybook/vue3/preset')),
  }
}

export const previewAnnotations: PresetProperty<'previewAnnotations'> = (
  entry = [],
) => [...entry, PREVIEW_ENTRY]

/** Merges the Nuxt app's Vite config into the one @storybook/vue3-vite built. */
export const viteFinal: StorybookConfig['viteFinal'] = async (
  config,
  options,
) => {
  const storybookViteConfig = await vueViteFinal(config, options)
  const { components, imports, nuxt, serverComponentRuntime, viteConfig } =
    await loadNuxtViteConfig(storybookViteConfig.root)
  const finalViteConfig = await mergeViteConfig(
    storybookViteConfig,
    viteConfig,
    nuxt,
  )

  const names = await readMockedNames(options)
  const mockedImports = resolveMockedImports(names.imports, imports)
  const mockedComponents = resolveMockedComponents(names.components, components)
  return mergeConfig(finalViteConfig, {
    plugins: [
      storyFilesPlugin(),
      mockImportsPlugin(mockedImports, mockedComponents),
      mockComponentsPlugin(mockedComponents, serverComponentRuntime),
    ],
  })
}
