import type { EventHandler, HTTPMethod } from 'h3'
import { hookCanvas } from '../story/hook-context'

export type EndpointHandler = EventHandler

export interface EndpointOptions {
  handler: EndpointHandler

  /**
   * HTTP method the handler answers.
   *
   * @default undefined
   */
  method?: HTTPMethod | Lowercase<HTTPMethod>

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
  canvasElement?: EventTarget
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
  // Injected by vite plugin
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
    // Not a top-level call, which the build tells its file: one of a story hook
    return register(
      hookRegistry(storyOrUrl),
      storyOrUrl,
      urlOrEndpoint as Endpoint,
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
  if (story.canvasElement) {
    canvasStories.set(story.canvasElement, story.id)
  }
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
  registries: (input: RequestInfo | URL, init?: RequestInit) => Registry[],
): typeof fetch {
  return async (input, init) => {
    const keys = requestKeys(input)
    const scoped = registries(input, init)
    // unregistered same-origin urls reach the dev Server instead of a 404, as Storybook has no Nitro
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

export function requestRegistries(
  input: RequestInfo | URL,
  story: (call: string) => EndpointScope | undefined,
): Registry[] {
  return isEndpointUrl(input)
    ? endpointRegistries(story(`fetch('${urlOf(input)}')`))
    : []
}

const storyRegistries = new Map<string, Registry>()

// The story of each canvas, to scope the calls of its hooks
const canvasStories = new WeakMap<EventTarget, string>()

const importPathRegistries = new Map<string, ImportPathRegistry>()

function hookRegistry(url: string): Registry {
  const canvas = hookCanvas()
  const id = canvas && canvasStories.get(canvas)
  if (id === undefined) {
    throw new Error(
      `registerEndpoint('${url}') was not processed by the Nuxt Storybook build, and its story is unknown. Call it at the top level of a story file, in a hook written in the story file, or pass the story context as first argument.`,
    )
  }
  return storyRegistryOf(id)
}

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
  const handlers = keys.map((key) => registry.get(key)).find(Boolean) ?? []
  return handlers.findLast(
    (handler) =>
      !handler.method || handler.method.toUpperCase() === method.toUpperCase(),
  )
}

function isEndpointUrl(input: RequestInfo | URL): boolean {
  const keys = requestKeys(input)
  const registries = [
    ...storyRegistries.values(),
    ...[...importPathRegistries.values()].map((entry) => entry.registry),
  ]
  return registries.some((registry) => keys.some((key) => registry.has(key)))
}

// 'https://api.example.com/users?page=2' is registered with or without its Query; '/api/users?page=2' too, also when fetched by its absolute url
function requestKeys(input: RequestInfo | URL): string[] {
  const url = urlOf(input)
  const { origin, pathname, search } = new URL(url, location.origin)
  const urls = origin === location.origin ? [url, pathname + search] : [url]
  return [...new Set([...urls, ...urls.map((key) => key.split('?')[0])])]
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
