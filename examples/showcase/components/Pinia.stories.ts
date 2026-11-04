import preview from '../.storybook/preview'
import PiniaTest from './PiniaTest.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = preview.meta({
  title: 'Modules/Pinia',
  component: PiniaTest,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
})

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const Pinia = meta.story({
  args: { msg: 'Storybook ❤️‍🔥 Nuxt ❤️‍🔥 Pinia' },
})
