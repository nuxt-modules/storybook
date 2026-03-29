import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils'

// oxlint-disable-next-line jest/valid-describe-callback -- https://github.com/oxc-project/oxc/issues/17643
describe('ssr', async () => {
  await setup({
    rootDir: resolve(dirname(fileURLToPath(import.meta.url)), '../playground'),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    console.log(html)
    expect(html).toContain('Welcome to Nuxt!')
  })
})
