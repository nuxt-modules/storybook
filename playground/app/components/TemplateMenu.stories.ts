import type { Meta, StoryObj } from '@nuxtjs/storybook'

import TemplateMenu from './TemplateMenu.vue'

const meta = {
  title: 'Starter App/Components/Template Menu',
  component: TemplateMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof TemplateMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
