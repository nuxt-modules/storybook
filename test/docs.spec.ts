import { describe, expect, it } from 'vitest'

import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'node:url'

import { $fetch, setup } from '@nuxt/test-utils'

// oxlint-disable-next-line jest/valid-describe-callback -- https://github.com/oxc-project/oxc/issues/17643
describe('ssr', async () => {
  await setup({
    rootDir: resolve(dirname(fileURLToPath(import.meta.url)), '../docs'),
    setupTimeout: 1_200_000,
  })

  it('renders the index page', { timeout: 1_200_000 }, async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    console.log(html)
    expect(html).toContain('Add Storybook')
  })
})
