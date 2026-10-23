import { mockComponent } from '@storybook-vue/nuxt'
import { expect, within } from 'storybook/test'
import { defineComponent, h } from 'vue'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyNuxtIslandHost from './MyNuxtIslandHost.vue'

// A server component renders as an island, which Storybook cannot fetch:
// The mock stands in for it with a plain client component
mockComponent('MyNuxtIsland', () =>
  defineComponent({
    props: { label: String },
    setup: (props) => () =>
      h('p', { class: 'storybook' }, `${props.label}: mocked island`),
  }),
)

const meta = {
  args: { label: 'Server time' },
  component: MyNuxtIslandHost,
  tags: ['autodocs'],
  title: 'Nuxt/Island Mocked',
} satisfies Meta<typeof MyNuxtIslandHost>

export default meta
type Story = StoryObj<typeof meta>

export const Mocked: Story = {
  async play({ canvasElement }) {
    await expect(
      within(canvasElement).getByText('Server time: mocked island'),
    ).toBeVisible()
  },
}
