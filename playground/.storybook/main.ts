import type { StorybookConfig } from '@nuxtjs/storybook'
import Inspect from 'vite-plugin-inspect'

const config: StorybookConfig = {
  addons: ['@storybook/addon-docs', '@chromatic-com/storybook'],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  viteFinal: (config) => {
    // For debugging purposes
    // View intermediate state of Vite plugins at http://localhost:6006/__inspect
    config.plugins!.push(
      Inspect({
        build: true,
        outputDir: 'storybook-static/.vite-inspect',
      }),
    )
    return config
  },
}
export default config
