import type { Meta, StoryObj } from '@storybook/vue3'

import CustomComponent from './CustomComponent.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

/**
 * Shows how to use custom components (defined in the `components` folder) in a story.
 */
const meta = {
  title: 'Features/Custom Components',
  component: CustomComponent,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'clicked' },
  },
  args: { primary: false }, // default value
} satisfies Meta<typeof CustomComponent>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const SimpleComponent: Story = {
  args: { primary: true, label: 'Primary' },
}

export const CustomTemplate: Story = {
  args: { primary: true, label: 'My Story' },
  render: (args) => ({
    components: { CustomComponent },
    setup() {
      return { args }
    },
    template: '<custom-component v-bind="args">Hello</custom-component>',
  }),
}
