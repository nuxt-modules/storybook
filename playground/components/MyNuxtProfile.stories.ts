import { expect, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtProfile from './MyNuxtProfile.vue'

const meta = preview.meta({
  args: { name: 'Ada Lovelace' },
  component: MyNuxtProfile,
  tags: ['autodocs'],
  title: 'Nuxt/Profile',
})

export const Default = meta.story({
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText('AL')).toBeVisible()
  },
})
