import { useRouter } from 'vue-router'

import preview from '../.storybook/preview'
import CustomNav from './CustomNav.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = preview.meta({
  title: 'Features/Router',
  component: CustomNav,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
})

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const Home = meta.story({
  args: {},
  render(args) {
    return {
      components: { CustomNav },
      setup() {
        // oxlint-disable-next-line typescript/no-floating-promises -- doesn't work with async setup for some reason
        useRouter().push('/')
        return { args }
      },
      template: '<div><CustomNav /></div>',
    }
  },
})
