import { expect, userEvent, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtState from './MyNuxtState.vue'

const meta = preview.meta({
  component: MyNuxtState,
  tags: ['autodocs'],
  title: 'Nuxt/State',
})

export const Initial = meta.story()

export const Incremented = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button'))
    await userEvent.click(canvas.getByRole('button'))

    await expect(canvas.getByText(/^count: /)).toHaveTextContent('count: 2')
  },
})

// Each story owns its Nuxt app: the clicks of `Incremented` must not leak here
export const IsolatedFromOtherStories = meta.story({
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText(/^count: /)).toHaveTextContent(
      'count: 0',
    )
  },
})
