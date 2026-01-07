import type { Meta, StoryObj } from '@nuxtjs/storybook'
import I18nDemo from './I18nDemo.vue'

const meta = {
  title: 'Plugins/I18nDemo',
  component: I18nDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof I18nDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
