import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'node:url'

import { $fetch, setup } from '@nuxt/test-utils'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../docs')

// oxlint-disable-next-line jest/valid-describe-callback -- https://github.com/oxc-project/oxc/issues/17643
describe.skipIf(process.platform === 'win32')('ssr', async () => {
  // Twoslash and nuxt-og-image resolve the packages of the docs from the working directory
  process.chdir(rootDir)
  await setup({
    rootDir,
    setupTimeout: 1_200_000,
  })

  it('renders the index page', { timeout: 1_200_000 }, async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    console.log(html)
    expect(html).toContain('Storybook for Nuxt')
  })
})
