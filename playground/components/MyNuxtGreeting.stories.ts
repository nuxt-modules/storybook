import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtGreeting from './MyNuxtGreeting.vue'

const meta = {
  args: { name: 'Nuxt' },
  component: MyNuxtGreeting,
  tags: ['autodocs'],
  title: 'Nuxt/Greeting',
} satisfies Meta<typeof MyNuxtGreeting>

export default meta
type Story = StoryObj<typeof meta>

// `useGreeting` is the default export of its composable file
export const Default: Story = {
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText('Hello Nuxt')).toBeVisible()
  },
}
