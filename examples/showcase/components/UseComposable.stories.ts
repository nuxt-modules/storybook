import type { Meta, StoryObj } from '@storybook/vue3'

import UseComposable from './UseComposable.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

/**
 * Shows how to use a composable in a component
 */
const meta = {
  title: 'Features/Use Composable',
  component: UseComposable,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof UseComposable>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const UseComposableStory: Story = {
  args: {},
}
