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
  addons: ['@chromatic-com/storybook', '@storybook/addon-docs'],
}
export default config
