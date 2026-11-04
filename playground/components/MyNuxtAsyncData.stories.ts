import { expect, userEvent, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtAsyncData from './MyNuxtAsyncData.vue'

const meta = preview.meta({
  component: MyNuxtAsyncData,
  tags: ['autodocs'],
  title: 'Nuxt/AsyncData',
})

export const Resolved = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('status: success')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3)
  },
})

export const Slow = meta.story({
  args: { delay: 500 },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Grace')).toBeVisible()
  },
})

export const Failed = meta.story({
  args: { fail: true },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Request failed',
    )
  },
})

export const Refreshed = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByRole('button'))

    await expect(await canvas.findByText('status: success')).toBeVisible()
  },
})
