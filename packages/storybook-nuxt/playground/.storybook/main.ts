import type { StorybookConfig } from "@storybook-nuxt/framework";


const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook-nuxt/framework",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
