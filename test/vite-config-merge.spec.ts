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

function mockNuxt(dev = false): Nuxt {
  return {
    hook: () => {},
    options: {
      dev,
      devServer: dev ? { url: 'http://[::1]:3100/' } : {},
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

/** What the running app's client config looks like in embedded dev mode. */
function devAppConfig(): ViteConfig {
  return {
    plugins: [
      { name: 'vite:vue' },
      { name: 'nuxt:dev-server' },
      [{ name: 'nuxt:vite-node-server' }, { name: 'some-module:plugin' }],
    ],
    server: {
      fs: { allow: ['/app'] },
      middlewareMode: true,
      warmup: { clientFiles: ['/app/entry.ts'] },
      watch: { ignored: ['/app/.git'] },
    },
  }
}

function pluginNames(config: ViteConfig): unknown[] {
  return (config.plugins ?? [])
    .flat()
    .map((plugin) => (plugin && 'name' in plugin ? plugin.name : plugin))
}

describe('mergeViteConfig', () => {
  it('drops the plugins that wire the running nuxt dev server', async () => {
    // Shared plugin instances run `configureServer` against Storybook's
    // server too: nuxt:dev-server then rebinds Nuxt's dev middleware to
    // Storybook's middleware stack, whose /_nuxt proxy points back at Nuxt.
    const merged = await mergeViteConfig({}, devAppConfig(), mockNuxt(true))

    const names = pluginNames(merged)
    expect(names).not.toContain('nuxt:dev-server')
    expect(names).not.toContain('nuxt:vite-node-server')
    expect(names).toContain('some-module:plugin')
    expect(names).toContain('nuxt-storybook:templates-hmr')
  })

  it('inherits file serving but not the nuxt server wiring', async () => {
    const merged = await mergeViteConfig({}, devAppConfig(), mockNuxt(true))

    expect(merged.server?.fs?.allow).toContain('/app')
    expect(merged.server?.watch).toStrictEqual({ ignored: ['/app/.git'] })
    expect(merged.server?.middlewareMode).toBeUndefined()
    expect(merged.server?.warmup).toBeUndefined()
  })

  it('proxies nuxt routes to the dev server, and nothing else', async () => {
    const merged = await mergeViteConfig({}, devAppConfig(), mockNuxt(true))

    const rules = Object.entries(merged.server?.proxy ?? {})
    expect(rules).toHaveLength(1)
    const [route, rule] = rules[0]!
    expect('/_nuxt/@vite/client').toMatch(new RegExp(route))
    expect(rule).toMatchObject({
      changeOrigin: false,
      headers: { host: '[::1]:3100' },
      target: { host: '::1', port: 3100, protocol: 'http:' },
    })
  })

  it('does not proxy when nuxt is not running in dev mode', async () => {
    const merged = await mergeViteConfig({}, devAppConfig(), mockNuxt())

    expect(merged.server?.proxy).toStrictEqual({})
    expect(pluginNames(merged)).not.toContain('nuxt-storybook:templates-hmr')
  })

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
