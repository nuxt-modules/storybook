import { expect, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtGreeting from './MyNuxtGreeting.vue'

const meta = preview.meta({
  args: { name: 'Nuxt' },
  component: MyNuxtGreeting,
  tags: ['autodocs'],
  title: 'Nuxt/Greeting',
})

// `useGreeting` is the default export of its composable file
export const Default = meta.story({
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText('Hello Nuxt')).toBeVisible()
  },
})
