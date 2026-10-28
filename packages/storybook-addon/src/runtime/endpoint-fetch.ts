import { tryUseNuxtApp } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'
import { createEndpointApp } from './endpoint-app'
import type { EndpointApp } from './endpoints'
import {
  REQUEST_APP,
  createEndpointFetch,
  endpointRegistries,
} from './endpoints'
import { storyOf } from './nuxt-app'

type AppRequestInit = RequestInit & { [REQUEST_APP]?: NuxtApp }

let endpointApp: Promise<EndpointApp> | undefined

globalThis.fetch = createEndpointFetch(
  globalThis.fetch.bind(globalThis),
  // The project's h3, aliased by the preview config
  () => (endpointApp ??= import('h3').then(createEndpointApp)),
  (init?: AppRequestInit) =>
    endpointRegistries(
      storyOf(init?.[REQUEST_APP] ?? tryUseNuxtApp() ?? undefined),
    ),
)

// `$fetch` runs it synchronously, while the calling story's Nuxt context is current
globalThis.$fetch = globalThis.$fetch.create({
  onRequest({ options }) {
    ;(options as AppRequestInit)[REQUEST_APP] ??= tryUseNuxtApp() ?? undefined
  },
}) as typeof globalThis.$fetch
