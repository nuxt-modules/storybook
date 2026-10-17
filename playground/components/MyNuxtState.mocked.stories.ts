import { mockNuxtImport } from '@storybook-vue/nuxt'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtState from './MyNuxtState.vue'

// Applies to every story of this file; the factory runs once per story
const useCounter = mockNuxtImport('useCounter', () => () => {
  const count = ref(40)
  return { count, increment: () => count.value++ }
})

const meta = {
  component: MyNuxtState,
  tags: ['autodocs'],
  title: 'Nuxt/State Mocked',
} satisfies Meta<typeof MyNuxtState>

export default meta
type Story = StoryObj<typeof meta>

export const Initial: Story = {
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText(/^count: /)).toHaveTextContent(
      'count: 40',
    )
    await expect(useCounter).toHaveBeenCalledOnce()
  },
}

export const Incremented: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button'))

    await expect(canvas.getByText(/^count: /)).toHaveTextContent('count: 41')
  },
}
