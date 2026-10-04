import { expect } from 'vitest';
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtI18n from './MyNuxtI18n.vue'

const meta = {
  argTypes: {
    lang: { control: 'select', options: ['en', 'fr', 'ar'] },
  },
  component: MyNuxtI18n,
  tags: ['autodocs'],
  title: 'Nuxt/I18n',
} satisfies Meta<typeof MyNuxtI18n>

export default meta
type Story = StoryObj<typeof meta>

export const English: Story = {
  args: { lang: 'en' },
}

export const French: Story = {
  args: { lang: 'fr' },
  async play({ canvasElement }) {
    await expect(
      await within(canvasElement).findByTestId('message'),
    ).toHaveTextContent('Bienvenue')
  },
}

export const Arabic: Story = {
  args: { lang: 'ar' },
}

export const SwitchedByUser: Story = {
  args: { lang: 'en' },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByRole('button', { name: 'fr' }))

    await expect(await canvas.findByText('language: fr')).toBeVisible()
  },
}
