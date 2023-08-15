import type { Meta, StoryObj } from '@storybook-nuxt/framework';



import Home from '~/pages/index.vue'
import MainApp from '~/app.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: 'Pages/Home ',
  component: Home,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],

} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const NavPage : Story = {
  args: {  },
  render (args: any) {
    return({
        components: { MainApp , Home },
        template: '<div><MainApp /></div>',
    })
    },
}


