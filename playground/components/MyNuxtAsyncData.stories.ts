import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtAsyncData from './MyNuxtAsyncData.vue'

const meta = {
  component: MyNuxtAsyncData,
  tags: ['autodocs'],
  title: 'Nuxt/AsyncData',
} satisfies Meta<typeof MyNuxtAsyncData>

export default meta
type Story = StoryObj<typeof meta>

export const Resolved: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('status: success')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3)
  },
}

export const Slow: Story = {
  args: { delay: 500 },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Grace')).toBeVisible()
  },
}

export const Failed: Story = {
  args: { fail: true },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Request failed',
    )
  },
}

export const Refreshed: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByRole('button'))

    await expect(await canvas.findByText('status: success')).toBeVisible()
  },
}
