import addonDocs from '@storybook/addon-docs'
import addonLinks from '@storybook/addon-links'
import { definePreview } from '@storybook-vue/nuxt'

export default definePreview({
  addons: [addonDocs(), addonLinks()],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
})
