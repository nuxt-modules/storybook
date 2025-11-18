// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

export default createConfigForNuxt({
  features: {
    // Activate rules for module authors
    tooling: true,
  },
  dirs: {
    src: ['./playground'],
  },
}).override('nuxt/vue/rules', {
  rules: {
    'vue/html-self-closing': 'off',
  },
}).append(
  ...storybook.configs['flat/recommended']
)
