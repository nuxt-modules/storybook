import type { Meta, StoryObj } from '@nuxtjs/storybook'

import PlaygroundNav from './PlaygroundNav.vue'

const meta = {
  title: 'Playground/Navigation/NavBar',
  component: PlaygroundNav,
  tags: ['autodocs'],
} satisfies Meta<typeof PlaygroundNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
