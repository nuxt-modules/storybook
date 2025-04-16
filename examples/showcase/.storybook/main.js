/** @type { import('storybook-vue').StorybookConfig } */
const config = {
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../pages/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}
export default config
