import preview from '../.storybook/preview'
import SimpleDiv from './SimpleDiv.vue'

const meta = preview.meta({
  component: SimpleDiv,
  tags: ['autodocs'],
  title: 'Example/Simple Div',
})

export const SimpleDivStory = meta.story({
  args: {},
})
