import type { Meta, StoryObj } from '@storybook/vue3'

import MyGlobalComp from './globalComp.global.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: 'Features/Global components',
  component: MyGlobalComp,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof MyGlobalComp>

export default meta
type Story = StoryObj<typeof meta>

export const GlobalComponent: Story = {
  args: {},
}
