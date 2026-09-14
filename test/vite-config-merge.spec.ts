import { describe, expect, it } from 'vitest'

import { resolve } from 'pathe'
import type { Nuxt } from '@nuxt/schema'
import type { UserConfig as ViteConfig } from 'vite'
import { mergeViteConfig } from '../packages/storybook-addon/src/preset'

/**
 * In embedded mode the `nuxtConfig` argument is the running app's own resolved
 * Vite config, and vite's mergeConfig passes nested objects through by
 * reference — so writing to the merged result can reach back into the live dev
 * server and break the app's asset serving (#993).
 */

function mockNuxt(): Nuxt {
  return {
    options: {
      dev: false,
      modulesDir: [resolve(process.cwd(), 'node_modules')],
      rootDir: process.cwd(),
      runtimeConfig: { app: {} },
    },
  } as unknown as Nuxt
}

function appConfig(): ViteConfig {
  return {
    optimizeDeps: { exclude: ['vue'], include: ['vue', 'pinia'] },
    plugins: [{ name: 'vite:vue' }],
  }
}

describe('mergeViteConfig', () => {
  it('leaves the app config untouched', async () => {
    const nuxtConfig = appConfig()
    await mergeViteConfig({}, nuxtConfig, mockNuxt())

    expect(nuxtConfig).toMatchInlineSnapshot(`
      {
        "optimizeDeps": {
          "exclude": [
            "vue",
          ],
          "include": [
            "vue",
            "pinia",
          ],
        },
        "plugins": [
          {
            "name": "vite:vue",
          },
        ],
      }
    `)
  })

  it('drops included deps that nuxt excludes, and disables discovery', async () => {
    const merged = await mergeViteConfig({}, appConfig(), mockNuxt())

    expect(merged.optimizeDeps).toMatchInlineSnapshot(`
      {
        "exclude": [
          "vue",
        ],
        "include": [
          "pinia",
          "@nuxtjs/storybook > @storybook-vue/nuxt > @storybook/vue3 > lodash/kebabCase",
          "storybook > @storybook/core > jsdoc-type-pratt-parser",
          "react/jsx-runtime",
          "react",
          "react-dom/client",
        ],
        "noDiscovery": true,
        "rolldownOptions": undefined,
        "rollupOptions": undefined,
      }
    `)
  })

  it('replaces the nuxt vue plugin instead of appending a second one', async () => {
    const merged = await mergeViteConfig({}, appConfig(), mockNuxt())

    const vuePlugins = (merged.plugins ?? []).filter(
      (plugin) => plugin && 'name' in plugin && plugin.name === 'vite:vue',
    )
    expect(vuePlugins).toHaveLength(1)
  })
})
