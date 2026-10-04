import { createMemoryHistory } from 'vue-router'
import type { RouterConfig } from '@nuxt/schema'

const FALLBACK_ROUTE = {
  // Todo make it a proper fallback
  component: { render: () => null },
  name: 'storybook-fallback',
  path: '/:pathMatch(.*)*',
}

const routerOptions: RouterConfig = {
  history: (base) => createMemoryHistory(base),
  routes: (routes) => [...routes, FALLBACK_ROUTE],
}

export default routerOptions
