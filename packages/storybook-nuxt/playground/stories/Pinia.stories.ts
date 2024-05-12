import type { Meta, StoryObj } from '@storybook/vue3'

import MyComponent from '~/components/pinia/index.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: 'Plugins/Pinia ',
  component: MyComponent,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],

} satisfies Meta<typeof MyComponent>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const Pinia: Story = {
  args: { msg: 'Storybook ❤️‍🔥 Nuxt ❤️‍🔥 Pinia' },
}
