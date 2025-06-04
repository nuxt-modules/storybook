import type { Meta, StoryObj } from '@nuxtjs/storybook'

import MyComponent from './MyI18n.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: 'Modules/I18n',
  component: MyComponent,
  argTypes: {
    lang: { control: 'select', options: ['en', 'fr', 'ar'] },
  },

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

export const FrenchStory: Story = {
  args: { lang: 'fr' },
}

export const EnglishStory: Story = {
  args: { lang: 'en' },
}

export const ArabicStory: Story = {
  args: { lang: 'ar' },
}
