import { mockNuxtImport } from '@storybook-vue/nuxt'
import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import MyNuxtRouting from './MyNuxtRouting.vue'

// `useRoute` comes from Nuxt itself: the mock applies inside Nuxt too
mockNuxtImport(
  'useRoute',
  () => () =>
    ({ fullPath: '/mocked?from=story' }) as RouteLocationNormalizedLoaded,
)

const meta = {
  component: MyNuxtRouting,
  tags: ['autodocs'],
  title: 'Nuxt/Routing Mocked',
} satisfies Meta<typeof MyNuxtRouting>

export default meta
type Story = StoryObj<typeof meta>

export const MockedRoute: Story = {
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText(/^route: /)).toHaveTextContent(
      'route: /mocked?from=story',
    )
  },
}
