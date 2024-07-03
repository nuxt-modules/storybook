import type { StorybookConfig } from '@storybook-vue/nuxt'
import Inspect from 'vite-plugin-inspect'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: (config) => {
    // For debugging purposes
    // View intermediate state of Vite plugins at http://localhost:6006/__inspect
    config.plugins.push(
      Inspect({
        build: true,
        outputDir: 'storybook-static/.vite-inspect',
      }),
    )
    return config
  },
}
export default config
