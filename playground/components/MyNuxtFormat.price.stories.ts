import { mockNuxtImport } from '@storybook-vue/nuxt'
import { expect, waitFor, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtFormat from './MyNuxtFormat.vue'

const formatPrice = mockNuxtImport(
  'formatPrice',
  () => (amount: number) => `Mocked ${amount} €`,
)

// DocsPageErrors.mdx renders these stories next to the ones of another file
const meta = preview.meta({
  args: { amount: 10, format: 'price' },
  component: MyNuxtFormat,
  parameters: { chromatic: { disableSnapshot: true } },
  title: 'Nuxt/Docs Page Errors/Price',
})

export const Price = meta.story({
  async play({ canvasElement }) {
    await expect(
      within(canvasElement).getByTestId('formatted'),
    ).toHaveTextContent('Mocked 10 €')
  },
})

// Throws `NuxtMocksSharedOnDocsPageError` on the docs page
export const FormattedInHelper = meta.story({
  async beforeEach({ viewMode }) {
    await formatOnceMounted(viewMode === 'docs')
  },
})

// The build keeps the story context after the `await`s of the hooks only
async function formatOnceMounted(onDocsPage: boolean): Promise<string> {
  if (onDocsPage) {
    // Once the stories of both files are mounted
    await waitFor(
      () =>
        expect(
          document.querySelectorAll('[data-testid="formatted"]'),
        ).toHaveLength(2),
      { timeout: 10_000 },
    )
  }
  return formatPrice(1)
}
