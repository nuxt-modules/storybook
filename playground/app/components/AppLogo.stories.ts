import type { Meta, StoryObj } from '@nuxtjs/storybook'

import Logo from './AppLogo.vue'

const meta = {
  title: 'Starter App/Components/Logo',
  component: Logo,
  tags: ['autodocs'],
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
