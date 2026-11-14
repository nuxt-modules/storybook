import { mockNuxtImport } from '@storybook-vue/nuxt'
import { expect, waitFor, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtFormat from './MyNuxtFormat.vue'

const formatTotal = mockNuxtImport(
  'formatTotal',
  () => (amount: number) => `Mocked total: ${amount} €`,
)

// DocsPageErrors.mdx renders these stories next to the ones of another file
const meta = preview.meta({
  args: { amount: 20, format: 'total' },
  component: MyNuxtFormat,
  parameters: { chromatic: { disableSnapshot: true } },
  title: 'Nuxt/Docs Page Errors/Total',
})

export const Total = meta.story({
  async play({ canvasElement }) {
    await expect(
      within(canvasElement).getByTestId('formatted'),
    ).toHaveTextContent('Mocked total: 20 €')
  },
})

// Throws `NuxtSpySharedOnDocsPageError` on the docs page
export const ConfiguredInHelper = meta.story({
  async beforeEach({ viewMode }) {
    await configureOnceMounted(viewMode === 'docs')
  },
  async play({ canvasElement }) {
    await expect(
      within(canvasElement).getByTestId('formatted'),
    ).toHaveTextContent('Configured total')
  },
})

// The build keeps the story context after the `await`s of the hooks only
async function configureOnceMounted(onDocsPage: boolean): Promise<void> {
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
  formatTotal.mockReturnValue('Configured total')
}
