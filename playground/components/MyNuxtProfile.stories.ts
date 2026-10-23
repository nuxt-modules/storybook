import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtProfile from './MyNuxtProfile.vue'

const meta = {
  args: { name: 'Ada Lovelace' },
  component: MyNuxtProfile,
  tags: ['autodocs'],
  title: 'Nuxt/Profile',
} satisfies Meta<typeof MyNuxtProfile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText('AL')).toBeVisible()
  },
}
