/** @type { import('storybook-vue').StorybookConfig } */
const config = {
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  stories: ['../components/**/*.mdx', '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links', '@chromatic-com/storybook'],
  docs: {
    autodocs: 'tag',
  },
}
export default config
