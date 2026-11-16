import { expect, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtPluginEnv from './MyNuxtPluginEnv.vue'

const meta = preview.meta({
  component: MyNuxtPluginEnv,
  title: 'Nuxt/PluginEnv',
})

export const SkippedInStorybook = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('env-default')).toHaveTextContent('ran')
    await expect(canvas.getByTestId('env-no-storybook')).toHaveTextContent(
      'skipped',
    )
  },
})
