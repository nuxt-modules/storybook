/** @type { import('storybook-vue').StorybookConfig } */
const config = {
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
  ],
  docs: {
    autodocs: 'tag',
  },
}
export default config
