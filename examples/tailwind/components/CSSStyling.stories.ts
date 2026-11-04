import preview from '../.storybook/preview'
import CSSStyling from './CSSStyling.vue'

const meta = preview.meta({
  component: CSSStyling,
  tags: ['autodocs'],
  title: 'Example/CSS Styling',
})

export const CSSStylingStory = meta.story({
  args: {},
})
