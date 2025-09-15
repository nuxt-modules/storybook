import type { Meta, StoryObj } from '@nuxtjs/storybook'

import NuxtUIShowcase from './NuxtUIShowcase.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

/**
 * Shows how to use Nuxt UI v4.0.0-alpha.1 components in a story.
 * This story demonstrates various Nuxt UI components including Button, Badge, Card, and Alert.
 * Note: These are mock components created for compatibility with Nuxt 3.x to demonstrate v4.0.0-alpha.1 features.
 */
const meta = {
  title: 'Examples/Nuxt UI v4.0.0-alpha.1',
  component: NuxtUIShowcase,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title for the showcase',
    },
    description: {
      control: 'text',
      description: 'Description text',
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'link'],
      description: 'Button variant',
    },
    color: {
      control: 'select',
      options: ['primary', 'gray', 'green', 'red', 'yellow'],
      description: 'Button color',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    'onButton-click': { action: 'button-clicked' },
  },
  args: {
    title: 'Nuxt UI v4.0.0-alpha.1 Showcase',
    description:
      'A showcase of Nuxt UI v4.0.0-alpha.1 components (mocked for compatibility)',
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof NuxtUIShowcase>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default showcase with all components
 */
export const Default: Story = {
  args: {
    title: 'Nuxt UI v4.0.0-alpha.1 Showcase',
    description:
      'A showcase of Nuxt UI v4.0.0-alpha.1 components (mocked for compatibility)',
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
}

/**
 * Showcase with outline variant
 */
export const OutlineVariant: Story = {
  args: {
    title: 'Outline Variant',
    description: 'Showcasing outline variant components',
    variant: 'outline',
    color: 'primary',
    size: 'md',
  },
}

/**
 * Showcase with different colors
 */
export const GreenTheme: Story = {
  args: {
    title: 'Green Theme',
    description: 'Showcasing green colored components',
    variant: 'solid',
    color: 'green',
    size: 'lg',
  },
}

/**
 * Showcase with ghost variant and red color
 */
export const GhostRed: Story = {
  args: {
    title: 'Ghost Red',
    description: 'Showcasing ghost variant with red color',
    variant: 'ghost',
    color: 'red',
    size: 'sm',
  },
}

/**
 * Minimal showcase with custom template
 */
export const CustomTemplate: Story = {
  args: {
    title: 'Custom Template',
    description: 'Custom rendered template showcase',
    variant: 'outline',
    color: 'gray',
    size: 'md',
  },
  render: (args: (typeof meta)['args']) => ({
    components: { NuxtUIShowcase },
    setup() {
      return { args }
    },
    template: `
      <div class="bg-gray-50 p-8 rounded-lg">
        <nuxt-u-i-showcase v-bind="args" />
      </div>
    `,
  }),
}
