import { mockNuxtImport } from '@storybook-vue/nuxt'
import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtGreeting from './MyNuxtGreeting.vue'

// `useGreeting` is the default export of its composable file
const useGreeting = mockNuxtImport(
  'useGreeting', 
  () =>  (name: string) => `Bonjour ${name}`
)

const meta = {
  args: { name: 'Nuxt' },
  component: MyNuxtGreeting,
  tags: ['autodocs'],
  title: 'Nuxt/Greeting Mocked',
} satisfies Meta<typeof MyNuxtGreeting>

export default meta
type Story = StoryObj<typeof meta>

export const Mocked: Story = {
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText('Bonjour Nuxt')).toBeVisible()
    await expect(useGreeting).toHaveBeenCalledWith('Nuxt')
  },
}
