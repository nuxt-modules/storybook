import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtErrorBoundary from './MyNuxtErrorBoundary.vue'

const meta = {
  component: MyNuxtErrorBoundary,
  tags: ['autodocs'],
  title: 'Nuxt/ErrorBoundary',
} satisfies Meta<typeof MyNuxtErrorBoundary>

export default meta
type Story = StoryObj<typeof meta>

export const Healthy: Story = {}

export const Caught: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByText('throw an error'))

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'caught: Boom',
    )
  },
}

export const Recovered: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByText('throw an error'))
    await userEvent.click(await canvas.findByText('recover'))

    await expect(await canvas.findByText('throw an error')).toBeVisible()
  },
}
