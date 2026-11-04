import preview from '../.storybook/preview'
import MyNuxtWelcome from './MyWelcome.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = preview.meta({
  title: 'Example/NuxtWelcome',
  component: MyNuxtWelcome,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
})

export const NuxtWelcomeStory = meta.story({
  args: {},
})
