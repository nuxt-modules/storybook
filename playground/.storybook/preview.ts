import addonDocs from '@storybook/addon-docs'
import { definePreview } from '@storybook-vue/nuxt'

export default definePreview({
  addons: [addonDocs()],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
})
