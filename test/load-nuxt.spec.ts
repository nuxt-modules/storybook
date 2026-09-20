import { describe, expect, it } from 'vitest'

import { fileURLToPath } from 'node:url'
import { loadNuxtViteConfig } from '../packages/storybook-addon/src/node/load-nuxt'

const playgroundDir = fileURLToPath(new URL('../playground', import.meta.url))

describe('loadNuxtViteConfig (standalone)', () => {
  it(
    'forces pages mode and installs the memory router options',
    { timeout: 120_000 },
    async () => {
      const { nuxt, viteConfig } = await loadNuxtViteConfig(playgroundDir)

      expect(nuxt.options.pages).toBeTruthy()
      expect(nuxt.options.ssr).toBe(false)
      expect(viteConfig.plugins?.length).toBeGreaterThan(0)

      const [, routerOptions] =
        Object.entries(nuxt.vfs).find(([id]) =>
          id.endsWith('router.options.mjs'),
        ) ?? []
      const imports = routerOptions?.match(/^import .*$/gm) ?? []
      expect(imports.at(-1)).toContain('storybook-addon')
      expect(imports.at(-1)).toContain('runtime/router.options')
    },
  )
})
