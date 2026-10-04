import { expect } from 'vitest';
import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtRuntimeConfig from './MyNuxtRuntimeConfig.vue'

const meta = {
  component: MyNuxtRuntimeConfig,
  tags: ['autodocs'],
  title: 'Nuxt/RuntimeConfig',
} satisfies Meta<typeof MyNuxtRuntimeConfig>

export default meta
type Story = StoryObj<typeof meta>

export const FromNuxtConfig: Story = {
  async play({ canvasElement }) {
    await expect(
      within(canvasElement).getByTestId('api-base'),
    ).toHaveTextContent('https://api.example.com')
  },
}

export const OverriddenByStory: Story = {
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
}
