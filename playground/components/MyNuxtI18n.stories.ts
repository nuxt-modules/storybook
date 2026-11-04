import { expect, userEvent, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtI18n from './MyNuxtI18n.vue'

const meta = preview.meta({
  argTypes: {
    lang: { control: 'select', options: ['en', 'fr', 'ar'] },
  },
  component: MyNuxtI18n,
  tags: ['autodocs'],
  title: 'Nuxt/I18n',
})

export const English = meta.story({
  args: { lang: 'en' },
})

export const French = meta.story({
  args: { lang: 'fr' },
  async play({ canvasElement }) {
    await expect(
      await within(canvasElement).findByTestId('message'),
    ).toHaveTextContent('Bienvenue')
  },
})

export const Arabic = meta.story({
  args: { lang: 'ar' },
})

export const SwitchedByUser = meta.story({
  args: { lang: 'en' },
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByRole('button', { name: 'fr' }))

    await expect(await canvas.findByText('language: fr')).toBeVisible()
  },
})
