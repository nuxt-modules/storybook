import MyNuxtWelcomeComponent from '../components/MyWelcome.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Example/NuxtWelcome',
  component: MyNuxtWelcomeComponent,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],

} satisfies Meta<typeof MyNuxtWelcomeComponent>

export default meta
type Story = StoryObj<typeof meta>

export const NuxtWelcomeStory: Story = {
  args: {},
}
