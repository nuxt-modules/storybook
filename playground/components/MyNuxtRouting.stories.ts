import { expect, userEvent, within } from 'storybook/test'
import { navigation } from '@storybook-vue/nuxt'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtRouting from './MyNuxtRouting.vue'

const meta = {
  component: MyNuxtRouting,
  tags: ['autodocs'],
  title: 'Nuxt/Routing',
} satisfies Meta<typeof MyNuxtRouting>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultRoute: Story = {}

export const CustomRoute: Story = {
  parameters: { nuxt: { route: '/products/42?tab=specs' } },
}

export const InternalLinkBlocked: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)
    // I18n may have moved a first-time visitor to a localised route
    const route = canvas.getByText(/^route: /).textContent

    await userEvent.click(canvas.getByText('internal link'))

    await expect(navigation).toHaveBeenCalledWith('/about')
    await expect(canvas.getByText(/^route: /)).toHaveTextContent(route)
  },
}

export const ExternalLinkBlocked: Story = {
  async play({ canvasElement }) {
    const previewUrl = location.href

    await userEvent.click(within(canvasElement).getByText('external link'))

    await expect(navigation).toHaveBeenCalledWith('https://nuxt.com/docs')
    await expect(location.href).toBe(previewUrl)
  },
}

export const NavigationAllowed: Story = {
  parameters: { nuxt: { navigation: true } },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByText('internal link'))

    await expect(canvas.getByText(/^route: /)).toHaveTextContent(/\/about$/)
    await expect(navigation).not.toHaveBeenCalled()
  },
}
