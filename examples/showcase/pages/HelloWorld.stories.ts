import preview from '../.storybook/preview'
import HelloWorldPage from './HelloWorld.vue'

const meta = preview.meta({
  component: HelloWorldPage,
  tags: ['autodocs'],
  title: 'Features/Pages as Stories',
})

export const Page = meta.story({
  args: {},
})

export const PageWithProps = meta.story({
  args: { name: 'John Doe' },
})
