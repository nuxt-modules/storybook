import type { NuxtApp } from 'nuxt/app'
import { createEndpointApp } from './app'
import type { EndpointApp } from './registry'
import { REQUEST_APP, createEndpointFetch, requestRegistries } from './registry'
import { storyOf } from '../app/nuxt-app'
import { isStoryContextAmbiguous, resolveStoryNuxtApp } from '../story/context'

type AppRequestInit = RequestInit & { [REQUEST_APP]?: NuxtApp }

let endpointApp: Promise<EndpointApp> | undefined

globalThis.fetch = createEndpointFetch(
  globalThis.fetch.bind(globalThis),
  () => (endpointApp ??= import('h3').then(createEndpointApp)),
  (input, init?: AppRequestInit) =>
    requestRegistries(input, (call) =>
      storyOf(init?.[REQUEST_APP] ?? resolveStoryNuxtApp(call)),
    ),
)

// `$fetch` runs it synchronously, while the calling story's Nuxt context is current
globalThis.$fetch = globalThis.$fetch.create({
  onRequest({ options }) {
    if (!(REQUEST_APP in options) && !isStoryContextAmbiguous()) {
      Object.assign(options, { [REQUEST_APP]: resolveStoryNuxtApp('$fetch') })
    }
  },
})
