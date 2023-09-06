import type { Preview } from "@storybook/vue3";

// import { config } from '@storybook-vue/nuxt/preview'


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};



// const  nuxtAppEntry  = await import('@storybook-vue/nuxt/preview')
   
// console.log('.storybook project Preview ============= config', config)
console.log('.storybook project Preview ==================-')


export default preview;
