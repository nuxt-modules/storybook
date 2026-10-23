import { mockComponent } from '@storybook-vue/nuxt'
import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtProfile from './MyNuxtProfile.vue'

// Replaces the auto-imported `<MyNuxtAvatar>` in every story of this file
mockComponent('MyNuxtAvatar', () => import('./MyNuxtAvatar.mock.vue'))

const meta = {
  args: { name: 'Ada Lovelace' },
  component: MyNuxtProfile,
  tags: ['autodocs'],
  title: 'Nuxt/Profile Mocked',
} satisfies Meta<typeof MyNuxtProfile>

export default meta
type Story = StoryObj<typeof meta>

export const Mocked: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('🧪 Ada Lovelace')).toBeVisible()
    await expect(canvas.queryByText('AL')).not.toBeInTheDocument()
  },
}
