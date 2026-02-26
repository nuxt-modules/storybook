import type { Meta, StoryObj } from '@nuxtjs/storybook'

import SimpleButton from './SimpleButton.vue'

/**
 * Shows how to use a decorator to wrap the story with extra markup.
 * https://storybook.js.org/docs/writing-stories/decorators
 */
const meta = {
  title: 'Storybook Feature/Use Decorators',
  component: SimpleButton,
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
} satisfies Meta<typeof SimpleButton>

export default meta
type Story = StoryObj<typeof meta>

export const UseDecoratorsStory: Story = {
  args: {},
}
