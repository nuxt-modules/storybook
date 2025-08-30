import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils'

describe('ssr', async () => {
  await setup({
    rootDir: resolve(dirname(fileURLToPath(import.meta.url)), '../docs'),
    setupTimeout: 1200000,
  })

  it('renders the index page', { timeout: 1200000 }, async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    console.log(html)
    expect(html).toContain('Add Storybook')
  })
})
