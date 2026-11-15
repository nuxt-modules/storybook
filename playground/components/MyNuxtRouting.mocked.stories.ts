import { mockNuxtImport } from '@storybook-vue/nuxt'
import { useRoute } from '#imports'
import { expect, within } from 'storybook/test'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import preview from '../.storybook/preview'
import MyNuxtRouting from './MyNuxtRouting.vue'

// `useRoute` comes from Nuxt itself: the mock applies inside Nuxt too.
// Like in `@nuxt/test-utils`, the import can name itself
mockNuxtImport(
  useRoute,
  () => () =>
    ({ fullPath: '/mocked?from=story' }) as RouteLocationNormalizedLoaded,
)

const meta = preview.meta({
  component: MyNuxtRouting,
  tags: ['autodocs'],
  title: 'Nuxt/Routing Mocked',
})

export const MockedRoute = meta.story({
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText(/^route: /)).toHaveTextContent(
      'route: /mocked?from=story',
    )
  },
})
