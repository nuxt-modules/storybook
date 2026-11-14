import { mockComponent } from '@storybook-vue/nuxt'
import { expect, within } from 'storybook/test'
import { h } from 'vue'

import preview from '../.storybook/preview'
import MyNuxtProfile from './MyNuxtProfile.vue'

// Replaces the auto-imported `<MyNuxtAvatar>` in every story of this file.
// Like in `@nuxt/test-utils`, its name or its path both work
mockComponent(
  '~/components/MyNuxtAvatar.vue',
  () => import('./MyNuxtAvatar.mock.vue'),
)

const meta = preview.meta({
  args: { name: 'Ada Lovelace' },
  component: MyNuxtProfile,
  tags: ['autodocs'],
  title: 'Nuxt/Profile Mocked',
})

export const Mocked = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('🧪 Ada Lovelace')).toBeVisible()
    await expect(canvas.queryByText('AL')).not.toBeInTheDocument()
  },
})

// Before the story renders: a mounted component keeps its mock
export const MockedInHook = meta.story({
  beforeEach() {
    mockComponent('MyNuxtAvatar', {
      props: { name: { required: true, type: String } },
      setup: (props: { name: string }) => () =>
        h('span', { class: 'storybook avatar' }, `🪝 ${props.name}`),
    })
  },
  async play({ canvasElement }) {
    await expect(
      within(canvasElement).getByText('🪝 Ada Lovelace'),
    ).toBeVisible()
  },
})
