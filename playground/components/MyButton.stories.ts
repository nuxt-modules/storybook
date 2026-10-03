import { expect, fn, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyButton from './MyButton.vue'

const meta = {
  args: { label: 'Button', onClick: fn() },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  component: MyButton,
  tags: ['autodocs'],
  title: 'Example/Button',
} satisfies Meta<typeof MyButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { primary: true },
}

export const Secondary: Story = {}

export const Large: Story = {
  args: { size: 'large' },
}

export const Small: Story = {
  args: { size: 'small' },
}

export const Clicked: Story = {
  async play({ args, canvasElement }) {
    await userEvent.click(within(canvasElement).getByRole('button'))

    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
