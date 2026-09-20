import { fileURLToPath } from 'node:url'
import { join, normalize } from 'pathe'
import stringify from 'json-stable-stringify'
import { viteFinal as vueViteFinal } from '@storybook/vue3-vite/preset'
import type { PresetProperty } from 'storybook/internal/types'
import { loadNuxtViteConfig } from './node/load-nuxt'
import { mergeViteConfig } from './node/vite-config'
import type { StorybookConfig } from './types.d'

export * from '@storybook/vue3-vite/preset'

/** Extensionless, so Vite picks the built `.mjs` next to this module. */
const PREVIEW_ENTRY = normalize(
  fileURLToPath(new URL('./preview', import.meta.url)),
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
    renderer: fileURLToPath(import.meta.resolve('@storybook/vue3-vite/preset')),
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
  const { nuxt, viteConfig } = await loadNuxtViteConfig(
    storybookViteConfig.root,
  )
  const finalViteConfig = await mergeViteConfig(
    storybookViteConfig,
    viteConfig,
    nuxt,
  )

  return finalViteConfig
}
