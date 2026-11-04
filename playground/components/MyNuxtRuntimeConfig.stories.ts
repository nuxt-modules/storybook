import { expect, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtRuntimeConfig from './MyNuxtRuntimeConfig.vue'

const meta = preview.meta({
  component: MyNuxtRuntimeConfig,
  tags: ['autodocs'],
  title: 'Nuxt/RuntimeConfig',
})

export const FromNuxtConfig = meta.story({
  async play({ canvasElement }) {
    await expect(
      within(canvasElement).getByTestId('api-base'),
    ).toHaveTextContent('https://api.example.com')
  },
})

export const OverriddenByStory = meta.story({
  parameters: {
    nuxt: {
      runtimeConfig: { public: { apiBase: 'https://staging.example.com' } },
    },
  },
  async play({ canvasElement }) {
    await expect(
      within(canvasElement).getByTestId('api-base'),
    ).toHaveTextContent('https://staging.example.com')
  },
})
