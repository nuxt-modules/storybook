import { expect, userEvent, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtErrorBoundary from './MyNuxtErrorBoundary.vue'

const meta = preview.meta({
  component: MyNuxtErrorBoundary,
  tags: ['autodocs'],
  title: 'Nuxt/ErrorBoundary',
})

export const Healthy = meta.story()

export const Caught = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByText('throw an error'))

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'caught: Boom',
    )
  },
})

export const Recovered = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByText('throw an error'))
    await userEvent.click(await canvas.findByText('recover'))

    await expect(await canvas.findByText('throw an error')).toBeVisible()
  },
})
