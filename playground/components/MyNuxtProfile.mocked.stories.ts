import { mockComponent } from '@storybook-vue/nuxt'
import { expect, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtProfile from './MyNuxtProfile.vue'

// Replaces the auto-imported `<MyNuxtAvatar>` in every story of this file
mockComponent('MyNuxtAvatar', () => import('./MyNuxtAvatar.mock.vue'))

const meta = preview.meta({
  args: { name: 'Ada Lovelace' },
  component: MyNuxtProfile,
  tags: ['autodocs'],
  title: 'Nuxt/Profile Mocked',
})

export const Mocked = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('🧪 Ada Lovelace')).toBeVisible()
    await expect(canvas.queryByText('AL')).not.toBeInTheDocument()
  },
})
