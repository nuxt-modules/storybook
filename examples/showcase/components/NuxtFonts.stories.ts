import type { Meta, StoryObj } from '@nuxtjs/storybook'

import NuxtFontsComponent from './NuxtFonts.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: 'Modules/Nuxt Fonts',
  component: NuxtFontsComponent,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof NuxtFontsComponent>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const NuxtFonts: Story = {
  args: {},
}
