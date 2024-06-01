import HelloWorldPage from './HelloWorld.vue'

const meta = {
  title: 'Features/Pages as Stories',
  component: HelloWorldPage,
  tags: ['autodocs'],
}

export default meta

export const Page = {
  args: {},
}

export const PageWithProps = {
  args: { name: 'John Doe' },
}
