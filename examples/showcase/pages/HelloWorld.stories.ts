import HelloWorldPage from './HelloWorld.vue'

const meta = {
  component: HelloWorldPage,
  tags: ['autodocs'],
  title: 'Features/Pages as Stories',
}

export default meta

export const Page = {
  args: {},
}

export const PageWithProps = {
  args: { name: 'John Doe' },
}
