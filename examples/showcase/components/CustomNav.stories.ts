import type { Meta, StoryObj } from '@storybook/vue3'
import { useRouter } from 'vue-router'

import CustomNav from './CustomNav.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: 'Features/Router',
  component: CustomNav,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof CustomNav>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const Home: Story = {
  args: {},
  render(args) {
    return {
      components: { CustomNav },
      setup() {
        useRouter().push('/')
        return { args }
      },
      template: '<div><CustomNav /></div>',
    }
  },
}
