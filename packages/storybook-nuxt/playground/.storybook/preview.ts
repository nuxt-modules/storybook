import { type Preview } from "@storybook-vue/nuxt";

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
console.log('.storybook Preview =============')
export default preview;
