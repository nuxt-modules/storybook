import type { Meta, StoryObj } from '@storybook/vue3'

import MyNuxtLink from './MyNuxtLink.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

/**
 * Shows how to use NuxtLink component
 */
const meta = {
  title: 'Features/Nuxt Link',
  component: MyNuxtLink,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    default: {
      control: 'text',
      description: 'Link text',
    },
  },
  args: {
    default: 'Nuxt Link',
  },
} satisfies Meta<typeof MyNuxtLink>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const NuxtLinkInCustomComponent: Story = {
  args: {},
  render(args) {
    return {
      components: { MyNuxtLink },
      setup: () => ({ args }),
      template: '<my-nuxt-link>{{ args.default }}</my-nuxt-link>',
    }
  },
}
export const NuxtLinkInTemplate: Story = {
  args: {},
  render(args) {
    return {
      setup: () => ({ args }),
      template: '<NuxtLink>{{ args.default }}</NuxtLink>',
    }
  },
}
