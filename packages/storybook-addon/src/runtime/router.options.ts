import { createMemoryHistory } from 'vue-router'
import type { RouterConfig } from '@nuxt/schema'

const routerOptions: RouterConfig = {
  history: (base) => createMemoryHistory(base),
}

export default routerOptions
