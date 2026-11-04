import { defineMain } from '@storybook-vue/nuxt/node'

export default defineMain({
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../pages/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
})
