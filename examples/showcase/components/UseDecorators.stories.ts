import type { Meta, StoryObj } from '@nuxtjs/storybook'

import SimpleButton from './SimpleButton.vue'

/**
 * Shows how to use a decorator to wrap the story with extra markup.
 * https://storybook.js.org/docs/writing-stories/decorators
 */
const meta = {
  component: SimpleButton,
  decorators: [
    () => ({ template: '<div style="margin: 3em;"><story/></div>' }),
  ],
  tags: ['autodocs'],
  title: 'Storybook Feature/Use Decorators',
} satisfies Meta<typeof SimpleButton>

export default meta
type Story = StoryObj<typeof meta>

export const UseDecoratorsStory: Story = {
  args: {},
}
