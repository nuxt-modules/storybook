import type { StorybookConfig } from '@nuxtjs/storybook'

const config: StorybookConfig = {
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: ['@chromatic-com/storybook', '@storybook/addon-docs'],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
}
export default config
