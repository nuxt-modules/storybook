import type { EventHandler } from 'h3'

export type EndpointHandler = EventHandler

export interface EndpointOptions {
  handler: EndpointHandler

  /**
   * HTTP method the handler answers.
   *
   * @default undefined
   */
  method?: string

  /**
   * Unregisters the handler after its first call.
   *
   * @default false
   */
  once?: boolean
}

export type Endpoint = EndpointHandler | EndpointOptions

export interface EndpointApp {
  fetch(request: Request, handler: EndpointHandler): Promise<Response>
}

/** The parts of a story context the endpoints need. */
export interface EndpointStory {
  id: string
  parameters: { nuxt?: { endpoints?: Record<string, Endpoint> } }
}

interface RegisteredEndpoint extends EndpointOptions {
  registry: Registry
  url: string
}

type Registry = Map<string, RegisteredEndpoint[]>

interface ImportPathRegistry {
  generation: number
  registry: Registry
}

/** The story a Nuxt app renders, as `storyOf` of `nuxt-app` returns it. */
interface EndpointScope {
  importPath: string
  storyId: string
}

// Captures the calling story's app when `$fetch` is called: fetch and retries
// run later, when another story's app may be current
export const REQUEST_APP = Symbol('nuxt-storybook:request-app')

export function registerEndpoint(
  story: EndpointStory,
  url: string,
  endpoint: Endpoint,
): () => void
export function registerEndpoint(url: string, endpoint: Endpoint): () => void
export function registerEndpoint(
  storyOrUrl: EndpointStory | string,
  urlOrEndpoint: string | Endpoint,
  endpointOrImportPath?: Endpoint | string,
  // injected by vite plugin
  generation = 0,
): () => void {
  if (typeof storyOrUrl !== 'string') {
    return register(
      storyRegistryOf(storyOrUrl.id),
      urlOrEndpoint as string,
      endpointOrImportPath as Endpoint,
    )
  }
  if (typeof endpointOrImportPath !== 'string') {
    throw new Error(
      `registerEndpoint('${storyOrUrl}') was not processed by the Nuxt Storybook build. Call it at the top level of a story file, or pass the story context as first argument in a story hook.`,
    )
  }
  return register(
    importPathRegistryOf(endpointOrImportPath, generation),
    storyOrUrl,
    urlOrEndpoint as Endpoint,
  )
}

export function beginStoryEndpoints(story: EndpointStory): void {
  const registry: Registry = new Map()
  for (const [url, endpoint] of Object.entries(
    story.parameters.nuxt?.endpoints ?? {},
  )) {
    register(registry, url, endpoint)
  }
  storyRegistries.set(story.id, registry)
}

export function endpointRegistries(
  story: EndpointScope | undefined,
): Registry[] {
  if (!story) {
    return []
  }
  return [
    storyRegistries.get(story.storyId),
    importPathRegistries.get(story.importPath)?.registry,
  ].filter((registry) => registry !== undefined)
}

export function createEndpointFetch(
  baseFetch: typeof fetch,
  app: () => Promise<EndpointApp>,
  registries: (init?: RequestInit) => Registry[],
): typeof fetch {
  return async (input, init) => {
    const keys = requestKeys(input)
    const scoped = registries(init)
    // Unlike @nuxt/test-utils, unregistered same-origin urls reach the dev
    // server instead of a 404, as Storybook has no Nitro
    if (!scoped.some((registry) => keys.some((key) => registry.has(key)))) {
      return baseFetch(input, init)
    }
    const request = toRequest(input, init)
    const endpoint = findEndpoint(scoped, keys, request.method)
    if (!endpoint) {
      return new Response('Not Found', { status: 404, statusText: 'Not Found' })
    }
    return (await app()).fetch(request, endpoint.handler)
  }
}

const storyRegistries = new Map<string, Registry>()

const importPathRegistries = new Map<string, ImportPathRegistry>()

function storyRegistryOf(id: string): Registry {
  let registry = storyRegistries.get(id)
  if (!registry) {
    registry = new Map()
    storyRegistries.set(id, registry)
  }
  return registry
}

function importPathRegistryOf(
  importPath: string,
  generation: number,
): Registry {
  let entry = importPathRegistries.get(importPath)
  if (entry?.generation !== generation) {
    entry = { generation, registry: new Map() }
    importPathRegistries.set(importPath, entry)
  }
  return entry.registry
}

function register(registry: Registry, url: string, endpoint: Endpoint) {
  const registered: RegisteredEndpoint =
    typeof endpoint === 'function'
      ? { handler: endpoint, registry, url }
      : { ...endpoint, registry, url }
  const handlers = registry.get(url) ?? []
  handlers.push(registered)
  registry.set(url, handlers)

  return () => unregister(registered)
}

function unregister(endpoint: RegisteredEndpoint) {
  const { registry, url } = endpoint
  const handlers = registry.get(url)
  const index = handlers?.indexOf(endpoint) ?? -1
  if (index === -1) {
    return
  }
  handlers!.splice(index, 1)
  if (handlers!.length === 0) {
    registry.delete(url)
  }
}

function findEndpoint(registries: Registry[], keys: string[], method: string) {
  for (const registry of registries) {
    const endpoint = findIn(registry, keys, method)
    if (endpoint) {
      if (endpoint.once) {
        unregister(endpoint)
      }
      return endpoint
    }
  }
}

function findIn(registry: Registry, keys: string[], method: string) {
  const key = keys.find((candidate) => registry.has(candidate))
  const handlers = (key && registry.get(key)) ?? []
  return handlers.findLast(
    (handler) =>
      !handler.method || handler.method.toUpperCase() === method.toUpperCase(),
  )
}

// 'https://api.example.com/users?page=2' is registered with or without its
// query; '/api/users?page=2' too, also when fetched by its absolute url
function requestKeys(input: RequestInfo | URL): string[] {
  const url = urlOf(input)
  const { origin, pathname, search } = new URL(url, location.origin)
  const urls = origin === location.origin ? [url, pathname + search] : [url]
  return [...new Set([...urls, ...urls.map((key) => key.split('?')[0]!)])]
}

function urlOf(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input
  }
  return input instanceof URL ? input.href : input.url
}

function toRequest(input: RequestInfo | URL, init?: RequestInit): Request {
  return input instanceof Request
    ? new Request(input, init)
    : new Request(new URL(urlOf(input), location.origin), init)
}
