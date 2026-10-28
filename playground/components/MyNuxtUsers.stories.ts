import { registerEndpoint } from '@storybook-vue/nuxt'
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtUsers from './MyNuxtUsers.vue'

const meta = {
  component: MyNuxtUsers,
  tags: ['autodocs'],
  title: 'Nuxt/Users',
} satisfies Meta<typeof MyNuxtUsers>

export default meta
type Story = StoryObj<typeof meta>

// Every story of this file, unless the story registers its own
registerEndpoint('/api/users', () => ['Alice', 'Bob'])

export const FromFile: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Bob')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2)
  },
}

export const Registered: Story = {
  beforeEach(context) {
    registerEndpoint(context, '/api/users', () => ['Eve', 'adam'])
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Eve')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1)
  },
}

export const FromParameters: Story = {
  parameters: {
    nuxt: { endpoints: { '/api/users': () => ['Carol'] } },
  },
  async play({ canvasElement }) {
    await expect(await within(canvasElement).findByText('Carol')).toBeVisible()
  },
}

export const Failing: Story = {
  beforeEach(context) {
    registerEndpoint(context, '/api/users', () => {
      throw new Error('users are unavailable')
    })
  },
  async play({ canvasElement }) {
    await expect(
      await within(canvasElement).findByRole('alert'),
    ).toHaveTextContent('500')
  },
}

export const Added: Story = {
  beforeEach(context) {
    const users = ['Alice']
    registerEndpoint(context, '/api/users', () => users)
    registerEndpoint(context, '/api/users', {
      handler: () => {
        users.push('Dan')
        return { ok: true }
      },
      method: 'POST',
    })
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.type(await canvas.findByLabelText('name'), 'Dan')
    await userEvent.click(canvas.getByRole('button'))

    await expect(await canvas.findByText('Dan')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2)
  },
}
