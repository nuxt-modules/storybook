import { defineMain } from '@storybook-vue/nuxt/node'
import Inspect from 'vite-plugin-inspect'

export default defineMain({
  addons: ['@storybook/addon-docs', '@chromatic-com/storybook'],
  framework: {
    name: '@storybook-vue/nuxt',
    options: { docgen: 'vue-component-meta' },
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
})
