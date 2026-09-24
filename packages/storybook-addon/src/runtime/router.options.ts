import { createMemoryHistory } from 'vue-router'
import type { RouterConfig } from '@nuxt/schema'

const FALLBACK_ROUTE = {
  // todo make it a proper fallback
  component: { render: () => null },
  name: 'storybook-fallback',
  path: '/:pathMatch(.*)*',
}

export default {
  history: (base) => createMemoryHistory(base),
  routes: (routes) => [...routes, FALLBACK_ROUTE],
} satisfies RouterConfig
