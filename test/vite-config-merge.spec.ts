import { resolve } from 'pathe'
import type { Nuxt } from '@nuxt/schema'
import type { UserConfig as ViteConfig } from 'vite'
import { mergeViteConfig } from '../packages/storybook-addon/src/node/vite-config'
import type { MockOptions } from '../packages/storybook-addon/src/node/plugins/mock-imports'

const NO_MOCKS: MockOptions = { imports: [], storyFiles: [] }

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

describe(mergeViteConfig, () => {
  it('leaves the app config untouched', async () => {
    const nuxtConfig = appConfig()
    await mergeViteConfig({}, nuxtConfig, mockNuxt(), NO_MOCKS)

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
    const merged = await mergeViteConfig({}, appConfig(), mockNuxt(), NO_MOCKS)

    expect(merged.optimizeDeps).toMatchInlineSnapshot(`
      {
        "exclude": [
          "vue",
        ],
        "include": [
          "pinia",
          "@nuxtjs/storybook > @storybook-vue/nuxt > @storybook/vue3 > lodash/kebabCase",
        ],
        "noDiscovery": true,
      }
    `)
  })

  it('replaces the nuxt vue plugin instead of appending a second one', async () => {
    const merged = await mergeViteConfig({}, appConfig(), mockNuxt(), NO_MOCKS)

    const vuePlugins = (merged.plugins ?? []).filter(
      (plugin) => plugin && 'name' in plugin && plugin.name === 'vite:vue',
    )
    expect(vuePlugins).toHaveLength(1)
  })
})
