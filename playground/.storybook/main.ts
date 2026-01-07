import type { StorybookConfig } from '@nuxtjs/storybook'

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|ts)',
    '../stories/**/*.stories.@(js|ts)',
  ],
  addons: [],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
}
export default config
