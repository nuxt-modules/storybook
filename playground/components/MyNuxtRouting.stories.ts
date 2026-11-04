import { expect, userEvent, within } from 'storybook/test'
import { navigation } from '@storybook-vue/nuxt'

import preview from '../.storybook/preview'
import MyNuxtRouting from './MyNuxtRouting.vue'

const meta = preview.meta({
  component: MyNuxtRouting,
  tags: ['autodocs'],
  title: 'Nuxt/Routing',
})

export const DefaultRoute = meta.story()

export const CustomRoute = meta.story({
  parameters: { nuxt: { route: '/products/42?tab=specs' } },
})

export const InternalLinkBlocked = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)
    // I18n may have moved a first-time visitor to a localised route
    const route = canvas.getByText(/^route: /).textContent

    await userEvent.click(canvas.getByText('internal link'))

    await expect(navigation).toHaveBeenCalledWith('/about')
    await expect(canvas.getByText(/^route: /)).toHaveTextContent(route)
  },
})

export const ExternalLinkBlocked = meta.story({
  async play({ canvasElement }) {
    const previewUrl = location.href

    await userEvent.click(within(canvasElement).getByText('external link'))

    await expect(navigation).toHaveBeenCalledWith('https://nuxt.com/docs')
    await expect(location.href).toBe(previewUrl)
  },
})

export const NavigationAllowed = meta.story({
  parameters: { nuxt: { navigation: true } },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByText('internal link'))

    await expect(canvas.getByText(/^route: /)).toHaveTextContent(/\/about$/)
    await expect(navigation).not.toHaveBeenCalled()
  },
})
