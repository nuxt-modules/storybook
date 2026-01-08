import type { StorybookConfig } from '@nuxtjs/storybook'

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|ts)',
    '../stories/**/*.stories.@(js|ts)',
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
}
export default config
