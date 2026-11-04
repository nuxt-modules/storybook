import { expect, fn, userEvent, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyButton from './MyButton.vue'

const meta = preview.meta({
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: { label: 'Button', onClick: fn() },
  component: MyButton,
  tags: ['autodocs'],
  title: 'Example/Button',
})

export const Primary = meta.story({
  args: { primary: true },
})

export const Secondary = meta.story()

export const Large = meta.story({
  args: { size: 'large' },
})

export const Small = meta.story({
  args: { size: 'small' },
})

export const Clicked = meta.story({
  async play({ args, canvasElement }) {
    await userEvent.click(within(canvasElement).getByRole('button'))

    await expect(args.onClick).toHaveBeenCalledOnce()
  },
})
