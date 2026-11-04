import preview from '../.storybook/preview'
import CustomComponent from './CustomComponent.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

/**
 * Shows how to use custom components (defined in the `components` folder) in a story.
 */
const meta = preview.meta({
  title: 'Features/Custom Components',
  component: CustomComponent,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'clicked' },
  },
  args: { primary: false }, // Default value
})

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const SimpleComponent = meta.story({
  args: { label: 'Primary', primary: true },
})

export const CustomTemplate = meta.story({
  args: { label: 'My Story', primary: true },
  render: (args) => ({
    components: { CustomComponent },
    setup() {
      return { args }
    },
    template: '<custom-component v-bind="args">Hello</custom-component>',
  }),
})
