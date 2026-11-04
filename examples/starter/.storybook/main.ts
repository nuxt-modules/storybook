import { defineMain } from '@storybook-vue/nuxt/node'

export default defineMain({
  addons: ['@chromatic-com/storybook', '@storybook/addon-docs'],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
})
