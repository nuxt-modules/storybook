import { registerEndpoint } from '@storybook-vue/nuxt'
import { createError } from 'h3'
import { expect, userEvent, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtUsers from './MyNuxtUsers.vue'

const meta = preview.meta({
  component: MyNuxtUsers,
  tags: ['autodocs'],
  title: 'Nuxt/Users',
})

// Every story of this file, unless the story registers its own
registerEndpoint('/api/users', () => ['Alice', 'Bob'])

export const FromFile = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Bob')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2)
  },
})

export const Registered = meta.story({
  beforeEach(context) {
    registerEndpoint(context, '/api/users', () => ['Eve', 'adam'])
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Eve')).toBeVisible()
    await expect(await canvas.findByText('adam')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2)
  },
})

export const FromParameters = meta.story({
  parameters: {
    nuxt: { endpoints: { '/api/users': () => ['Carol'] } },
  },
  async play({ canvasElement }) {
    await expect(await within(canvasElement).findByText('Carol')).toBeVisible()
  },
})

export const Failing = meta.story({
  beforeEach(context) {
    registerEndpoint(context, '/api/users', () => {
      throw createError({
        statusCode: 500,
        statusMessage: 'users are unavailable',
      })
    })
  },
  async play({ canvasElement }) {
    await expect(
      await within(canvasElement).findByRole('alert'),
    ).toHaveTextContent('500')
  },
})

export const Added = meta.story({
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
})

// In a story hook, the story context is optional
export const RegisteredInHook = meta.story({
  beforeEach() {
    registerEndpoint('/api/users', () => ['Grace'])
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(await canvas.findByText('Grace')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1)
  },
})
