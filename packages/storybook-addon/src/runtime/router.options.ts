import { createMemoryHistory } from 'vue-router'
import type { RouterConfig } from '@nuxt/schema'

export default {
  history: (base) => createMemoryHistory(base),
} satisfies RouterConfig
