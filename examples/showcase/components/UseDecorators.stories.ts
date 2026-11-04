import preview from '../.storybook/preview'
import SimpleButton from './SimpleButton.vue'

/**
 * Shows how to use a decorator to wrap the story with extra markup.
 * https://storybook.js.org/docs/writing-stories/decorators
 */
const meta = preview.meta({
  component: SimpleButton,
  decorators: [
    () => ({ template: '<div style="margin: 3em;"><story/></div>' }),
  ],
  tags: ['autodocs'],
  title: 'Storybook Feature/Use Decorators',
})

export const UseDecoratorsStory = meta.story({
  args: {},
})
