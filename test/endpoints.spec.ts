// @vitest-environment node

import type { NuxtApp } from '#app/nuxt'
import * as h3v1 from 'h3'
import * as h3v2 from 'h3-next'
import { createEndpointApp } from '../packages/storybook-addon/src/runtime/endpoints/app'
import type { H3Module } from '../packages/storybook-addon/src/runtime/endpoints/app'
import {
  REQUEST_APP,
  beginStoryEndpoints,
  createEndpointFetch,
  registerEndpoint,
  requestRegistries,
} from '../packages/storybook-addon/src/runtime/endpoints/registry'
import {
  NuxtMocksSharedOnDocsPageError,
  mountStory,
  resolveStoryNuxtApp,
  runInStoryContext,
  unmountStory,
} from '../packages/storybook-addon/src/runtime/story/context'
import { inStoryContext } from '../packages/storybook-addon/src/runtime/mocks/story-spies'
import type {
  Endpoint,
  EndpointStory,
} from '../packages/storybook-addon/src/runtime/endpoints/registry'

const IMPORT_PATH = './a.stories.ts'

const baseFetch = vi.fn<typeof fetch>(
  async () => new Response('from the network'),
)

vi.stubGlobal('location', { origin: 'http://localhost' })

// What `storyOf` of `nuxt-app` answers in the preview
const storyApps = new WeakMap<
  NuxtApp,
  { importPath: string; storyId: string }
>()

let currentApp: NuxtApp | undefined

// The addon resolves its own `nuxt`, not the one of the tests
const nuxtApp = await vi.hoisted(async () => {
  const { createRequire } = await import('node:module')
  const addon = createRequire(
    new URL('../packages/storybook-addon/package.json', import.meta.url),
  )
  return addon
    .resolve('nuxt/package.json')
    .replace(/package.json$/, 'dist/app/index.js')
})

vi.mock(nuxtApp, () => ({ tryUseNuxtApp: () => currentApp ?? null }))
let generation = 0

/** Runs a story the way the preview does: its hooks, then its Nuxt app. */
function runStory(
  id: string,
  hook: (context: EndpointStory) => void = () => {},
  endpoints?: Record<string, Endpoint>,
): NuxtApp {
  const context = storyContext(id, endpoints)
  beginStoryEndpoints(context)
  hook(context)
  currentApp = bindApp(id)
  return currentApp
}

function storyContext(
  id: string,
  endpoints?: Record<string, Endpoint>,
): EndpointStory {
  return { id, parameters: { nuxt: { endpoints } } }
}

function bindApp(id: string): NuxtApp {
  const app = {} as NuxtApp
  storyApps.set(app, { importPath: IMPORT_PATH, storyId: id })
  return app
}

// What `endpoint-fetch` does in the preview
function appRegistries(
  input: RequestInfo | URL,
  init?: RequestInit & { [REQUEST_APP]?: NuxtApp },
) {
  return requestRegistries(input, (call) => {
    const app = init?.[REQUEST_APP] ?? resolveStoryNuxtApp(call)
    return app && storyApps.get(app)
  })
}

function registerFileEndpoint(url: string, endpoint: Endpoint) {
  // What the story files transform makes of a top-level call
  return (
    registerEndpoint as (
      url: string,
      endpoint: Endpoint,
      importPath: string,
      generation: number,
    ) => () => void
  )(url, endpoint, IMPORT_PATH, generation)
}

beforeEach(() => {
  currentApp = undefined
  generation++
  // A new generation drops the file endpoints of the previous test
  registerFileEndpoint('/', () => {})()
  baseFetch.mockClear()
})

describe.each<[number, H3Module]>([
  [1, h3v1],
  [2, h3v2 as unknown as H3Module],
])('endpoints on h3 v%i', (_version, h3) => {
  const endpointFetch = createEndpointFetch(
    baseFetch,
    async () => createEndpointApp(h3),
    appRegistries,
  )

  it('answers a url registered by the story', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => ['Ada']),
    )

    const response = await endpointFetch('/api/users')

    await expect(response.json()).resolves.toStrictEqual(['Ada'])
    expect(baseFetch).not.toHaveBeenCalled()
  })

  it('passes an unregistered url through', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => ['Ada']),
    )

    const response = await endpointFetch('/api/other')

    await expect(response.text()).resolves.toBe('from the network')
    expect(baseFetch).toHaveBeenCalledWith('/api/other', undefined)
  })

  it('answers a registered url of another origin', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, 'https://api.example.com/users', () => ['Ada']),
    )

    const response = await endpointFetch('https://api.example.com/users')

    await expect(response.json()).resolves.toStrictEqual(['Ada'])
    expect(baseFetch).not.toHaveBeenCalled()
  })

  it('matches a url of another origin registered without its query', async () => {
    runStory('a', (context) =>
      registerEndpoint(
        context,
        'https://api.example.com/users',
        (event) => event.path,
      ),
    )

    const response = await endpointFetch(
      new URL('https://api.example.com/users?page=2'),
    )

    await expect(response.text()).resolves.toBe('/users?page=2')
    expect(baseFetch).not.toHaveBeenCalled()
  })

  it('passes an unregistered origin through', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => ['Ada']),
    )

    await endpointFetch('https://example.com/api/users')

    expect(baseFetch).toHaveBeenCalledWith(
      'https://example.com/api/users',
      undefined,
    )
  })

  it('matches a url registered without its query', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', (event) => event.path),
    )

    const response = await endpointFetch('/api/users?page=2')

    await expect(response.text()).resolves.toBe('/api/users?page=2')
  })

  it('answers a Request input', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => ['Ada']),
    )

    const response = await endpointFetch(
      new Request(new URL('/api/users', location.origin)),
    )

    await expect(response.json()).resolves.toStrictEqual(['Ada'])
  })

  it('picks the handler of the request method, latest first', async () => {
    runStory('a', (context) => {
      registerEndpoint(context, '/api/users', () => 'first')
      registerEndpoint(context, '/api/users', () => 'last')
      registerEndpoint(context, '/api/users', {
        handler: () => 'created',
        method: 'post',
      })
    })

    const got = await endpointFetch('/api/users')
    const posted = await endpointFetch('/api/users', { method: 'POST' })

    await expect(got.text()).resolves.toBe('last')
    await expect(posted.text()).resolves.toBe('created')
  })

  it('refuses a method no handler answers', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', {
        handler: () => 'got',
        method: 'GET',
      }),
    )

    const response = await endpointFetch('/api/users', { method: 'DELETE' })

    expect(response.status).toBe(404)
    expect(baseFetch).not.toHaveBeenCalled()
  })

  it('drops a once handler after its call', async () => {
    runStory('a', (context) => {
      registerEndpoint(context, '/api/users', () => 'always')
      registerEndpoint(context, '/api/users', {
        handler: () => 'once',
        once: true,
      })
    })

    const first = await endpointFetch('/api/users')
    const second = await endpointFetch('/api/users')

    await expect(first.text()).resolves.toBe('once')
    await expect(second.text()).resolves.toBe('always')
  })

  it('unregisters a handler', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => ['Ada'])(),
    )

    await endpointFetch('/api/users')

    expect(baseFetch).toHaveBeenCalledOnce()
  })

  it('reports a throwing handler as a server error', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => {
        throw new Error('down')
      }),
    )

    const response = await endpointFetch('/api/users')

    expect(response.status).toBe(500)
  })

  it('keeps the endpoints of each story to itself', async () => {
    const first = runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => ['Ada']),
    )
    const second = runStory('b', (context) =>
      registerEndpoint(context, '/api/users', () => ['Grace']),
    )

    currentApp = first
    const ofFirst = await endpointFetch('/api/users')
    currentApp = second
    const ofSecond = await endpointFetch('/api/users')
    runStory('c')
    await endpointFetch('/api/users')

    await expect(ofFirst.json()).resolves.toStrictEqual(['Ada'])
    await expect(ofSecond.json()).resolves.toStrictEqual(['Grace'])
    expect(baseFetch).toHaveBeenCalledOnce()
  })

  it('answers the story endpoints before the file ones', async () => {
    registerFileEndpoint('/api/me', () => ({ name: 'Ada' }))
    registerFileEndpoint('/api/users', () => ['file'])
    registerFileEndpoint('/api/users', {
      handler: () => 'created',
      method: 'POST',
    })
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', {
        handler: () => ['story'],
        method: 'GET',
      }),
    )

    const me = await endpointFetch('/api/me')
    const users = await endpointFetch('/api/users')
    const posted = await endpointFetch('/api/users', { method: 'POST' })

    await expect(me.json()).resolves.toStrictEqual({ name: 'Ada' })
    await expect(users.json()).resolves.toStrictEqual(['story'])
    await expect(posted.text()).resolves.toBe('created')
  })

  it('answers the endpoints of the story parameters, after its registered ones', async () => {
    runStory(
      'a',
      (context) =>
        registerEndpoint(context, '/api/users', () => ['registered']),
      {
        '/api/me': () => ({ name: 'Ada' }),
        '/api/users': () => ['parameters'],
      },
    )

    const me = await endpointFetch('/api/me')
    const users = await endpointFetch('/api/users')

    await expect(me.json()).resolves.toStrictEqual({ name: 'Ada' })
    await expect(users.json()).resolves.toStrictEqual(['registered'])
  })

  it('keeps the endpoints of stories registered interleaved apart', async () => {
    const a = storyContext('a')
    const b = storyContext('b')
    beginStoryEndpoints(a)
    beginStoryEndpoints(b)

    registerEndpoint(a, '/api/users', () => ['Ada'])
    registerEndpoint(b, '/api/users', () => ['Grace'])
    registerEndpoint(a, '/api/me', () => ({ name: 'Ada' }))

    currentApp = bindApp('a')
    const usersOfA = await endpointFetch('/api/users')
    const meOfA = await endpointFetch('/api/me')
    currentApp = bindApp('b')
    const usersOfB = await endpointFetch('/api/users')
    await endpointFetch('/api/me')

    await expect(usersOfA.json()).resolves.toStrictEqual(['Ada'])
    await expect(meOfA.json()).resolves.toStrictEqual({ name: 'Ada' })
    await expect(usersOfB.json()).resolves.toStrictEqual(['Grace'])
    expect(baseFetch).toHaveBeenCalledExactlyOnceWith('/api/me', undefined)
  })

  it('answers a request tagged with a story app from that story', async () => {
    const first = runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => ['Ada']),
    )
    runStory('b', (context) =>
      registerEndpoint(context, '/api/users', () => ['Grace']),
    )

    const response = await endpointFetch('/api/users', {
      [REQUEST_APP]: first,
    } as RequestInit)

    await expect(response.json()).resolves.toStrictEqual(['Ada'])
  })

  it('starts the story over on each run', async () => {
    runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => ['Ada']),
    )
    runStory('a')

    await endpointFetch('/api/users')

    expect(baseFetch).toHaveBeenCalledOnce()
  })

  it('starts the file over on each transform of it', async () => {
    registerFileEndpoint('/api/users', () => ['Ada'])
    generation++
    registerFileEndpoint('/api/me', () => ({ name: 'Ada' }))
    runStory('a')

    await endpointFetch('/api/users')

    expect(baseFetch).toHaveBeenCalledOnce()
  })
})

describe('endpoints on a docs page mixing story files', () => {
  const endpointFetch = createEndpointFetch(
    baseFetch,
    async () => createEndpointApp(h3v1),
    appRegistries,
  )
  const storyA = { canvasElement: new EventTarget(), importPath: IMPORT_PATH }
  const storyB = {
    canvasElement: new EventTarget(),
    importPath: './b.stories.ts',
  }

  afterEach(() => {
    unmountStory(storyA)
    unmountStory(storyB)
  })

  /** Mounts story 'a' and story 'b' of another file, each answering its id. */
  function mountBoth() {
    const appA = runStory('a', (context) =>
      registerEndpoint(context, '/api/story', () => 'a'),
    )
    const appB = runStory('b', (context) =>
      registerEndpoint(context, '/api/story', () => 'b'),
    )
    storyApps.set(appB, { importPath: storyB.importPath, storyId: 'b' })
    mountStory(storyA, appA)
    mountStory(storyB, appB)
    return { appA, appB }
  }

  it('throws for an untagged request outside of the Nuxt context, before any interaction', async () => {
    const { appA } = mountBoth()
    currentApp = undefined

    await expect(endpointFetch('/api/story')).rejects.toThrow(
      NuxtMocksSharedOnDocsPageError,
    )
    await expect(endpointFetch('/api/story')).rejects.toThrow(
      'parameters: { docs: { story: { inline: false } } }',
    )
    const init: RequestInit & { [REQUEST_APP]?: NuxtApp } = {
      [REQUEST_APP]: appA,
    }
    const tagged = await endpointFetch('/api/story', init)
    expect(await tagged.text()).toBe('a')
  })

  it('answers from the story last interacted with', async () => {
    mountBoth()

    storyA.canvasElement.dispatchEvent(new Event('pointerdown'))
    const fromA = await endpointFetch('/api/story')
    storyB.canvasElement.dispatchEvent(new Event('focusin'))
    const fromB = await endpointFetch('/api/story')

    expect(await fromA.text()).toBe('a')
    expect(await fromB.text()).toBe('b')
  })

  it('answers when a single story file is mounted', async () => {
    const app = runStory('a', (context) =>
      registerEndpoint(context, '/api/users', () => ['Ada']),
    )
    const otherA = { ...storyA, canvasElement: new EventTarget() }
    mountStory(storyA, app)
    mountStory(otherA, app)

    const response = await endpointFetch('/api/users')

    expect(await response.json()).toEqual(['Ada'])
    unmountStory(otherA)
  })

  it('answers inside the Nuxt context, and passes unregistered urls through', async () => {
    const { appA } = mountBoth()
    currentApp = appA
    storyB.canvasElement.dispatchEvent(new Event('pointerdown'))

    const response = await runInStoryContext(() => endpointFetch('/api/story'))
    await endpointFetch('/api/other')

    expect(await response.text()).toBe('a')
    expect(baseFetch).toHaveBeenCalledWith('/api/other', undefined)
  })
})

describe(registerEndpoint, () => {
  it('scopes a call of a story hook to its story, without its context', async () => {
    const endpointFetch = createEndpointFetch(
      baseFetch,
      async () => createEndpointApp(h3v1),
      appRegistries,
    )
    const story = {
      ...storyContext('hooked'),
      canvasElement: new EventTarget(),
    }
    beginStoryEndpoints(story)
    const beforeEach = inStoryContext(() =>
      registerEndpoint('/api/users', () => ['Ada']),
    ) as (context: object) => Promise<unknown>
    await beforeEach(story)
    currentApp = bindApp('hooked')

    const response = await endpointFetch('/api/users')
    currentApp = bindApp('other')
    await endpointFetch('/api/users')

    await expect(response.json()).resolves.toStrictEqual(['Ada'])
    expect(baseFetch).toHaveBeenCalledOnce()
  })

  it('throws for an untransformed top-level call', () => {
    expect(() => registerEndpoint('/api/users', () => [])).toThrow(
      "registerEndpoint('/api/users') was not processed by the Nuxt Storybook build",
    )
  })
})
