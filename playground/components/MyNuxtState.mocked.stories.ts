import { mockNuxtImport } from '@storybook-vue/nuxt'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import preview from '../.storybook/preview'
import MyNuxtState from './MyNuxtState.vue'

// Applies to every story of this file; the factory runs once per story
const useCounter = mockNuxtImport('useCounter', () => () => {
  const count = ref(40)
  return { count, increment: () => count.value++ }
})

const meta = preview.meta({
  component: MyNuxtState,
  tags: ['autodocs'],
  title: 'Nuxt/State Mocked',
})

export const Initial = meta.story({
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText(/^count: /)).toHaveTextContent(
      'count: 40',
    )
    await expect(useCounter).toHaveBeenCalledOnce()
  },
})

export const Incremented = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button'))

    await expect(canvas.getByText(/^count: /)).toHaveTextContent('count: 41')
  },
})
