import { type Preview } from "@storybook/vue3";
import { config } from '@storybook-vue/nuxt/preview'

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
console.log('.storybook Preview =============', config.framework, config.renderer, config.version)
export default preview;
