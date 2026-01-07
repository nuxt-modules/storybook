// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

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
    'vue/multi-word-component-names': 'off',
  },
})
