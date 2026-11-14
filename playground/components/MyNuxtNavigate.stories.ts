import { expect, userEvent, within } from 'storybook/test'
import { navigation } from '@storybook-vue/nuxt'

import preview from '../.storybook/preview'
import MyNuxtNavigate from './MyNuxtNavigate.vue'

const meta = preview.meta({
  component: MyNuxtNavigate,
  tags: ['autodocs'],
  title: 'Nuxt/NavigateTo',
})

export const Blocked = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)
    const route = canvas.getByText(/^route: /).textContent

    await userEvent.click(canvas.getByRole('button'))

    await expect(navigation).toHaveBeenCalledWith('/about')
    await expect(canvas.getByText(/^route: /)).toHaveTextContent(route)
  },
})

export const WithQuery = meta.story({
  args: { to: '/search?q=nuxt' },
  async play({ canvasElement }) {
    await userEvent.click(within(canvasElement).getByRole('button'))

    await expect(navigation).toHaveBeenCalledWith('/search?q=nuxt')
  },
})

export const Allowed = meta.story({
  parameters: { nuxt: { navigation: true } },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button'))

    await expect(canvas.getByText(/^route: /)).toHaveTextContent(/\/about$/)
    await expect(navigation).not.toHaveBeenCalled()
  },
})

// `navigateTo(url, { external: true })` would load another page in the preview
export const BlockedExternal = meta.story({
  args: { external: true, to: 'https://nuxt.com/docs' },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button'))

    await expect(navigation).toHaveBeenCalledWith('https://nuxt.com/docs')
    await expect(canvas.getByText(/^route: /)).toBeVisible()
  },
})

export const BlockedOpen = meta.story({
  args: { open: true, to: '/about' },
  async play({ canvasElement }) {
    await userEvent.click(within(canvasElement).getByRole('button'))

    await expect(navigation).toHaveBeenCalledWith('/about')
  },
})
