import preview from '../.storybook/preview'
import MyGlobalComp from './globalComp.global.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = preview.meta({
  title: 'Features/Global components',
  component: MyGlobalComp,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
})

export const GlobalComponent = meta.story({
  args: {},
})
