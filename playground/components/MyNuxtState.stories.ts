import { expect } from 'vitest';
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtState from './MyNuxtState.vue'

const meta = {
  component: MyNuxtState,
  tags: ['autodocs'],
  title: 'Nuxt/State',
} satisfies Meta<typeof MyNuxtState>

export default meta
type Story = StoryObj<typeof meta>

export const Initial: Story = {}

export const Incremented: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button'))
    await userEvent.click(canvas.getByRole('button'))

    await expect(canvas.getByText(/^count: /)).toHaveTextContent('count: 2')
  },
}

// Each story owns its Nuxt app: the clicks of `Incremented` must not leak here
export const IsolatedFromOtherStories: Story = {
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText(/^count: /)).toHaveTextContent(
      'count: 0',
    )
  },
}
