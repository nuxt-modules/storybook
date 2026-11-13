// @vitest-environment node

import type { NuxtApp } from '#app/nuxt'
import {
  bootStory,
  mountStory,
  runInStoryContext,
  trackStoryApp,
  unmountStory,
} from '../packages/storybook-addon/src/runtime/story-context'
import {
  NuxtSpySharedOnDocsPageError,
  beginStorySpies,
  executeStoryAsync,
  inStoryContext,
  storySpy,
} from '../packages/storybook-addon/src/runtime/story-spies'

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

const context = vi.hoisted(() => {
  const current: { app: NuxtApp | null } = { app: null }
  return current
})

vi.mock(nuxtApp, () => ({ tryUseNuxtApp: () => context.app }))

const useGreeting = storySpy('useGreeting', (name: string) => `Hello ${name}`)

const cleanups: (() => void)[] = []

interface Story {
  canvasElement: EventTarget
  importPath: string
}

/** Starts a story the way the preview `beforeEach` does. */
function begin(): Story {
  const canvasElement = new EventTarget()
  cleanups.push(beginStorySpies(canvasElement))
  return { canvasElement, importPath: './a.stories.ts' }
}

/** Runs a hook of a story file the way the build wraps it. */
function runHook(story: Story, hook: () => unknown): unknown {
  const wrapped = inStoryContext(hook)
  return typeof wrapped === 'function'
    ? Reflect.apply(wrapped, undefined, [story])
    : undefined
}

/** What the build makes of `await tick()` in a hook. */
async function awaitTick(): Promise<void> {
  const [awaited, restore] = executeStoryAsync(tick)
  await awaited
  restore()
}

function tick(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

afterEach(() => {
  for (const cleanup of cleanups.splice(0)) {
    cleanup()
  }
  context.app = null
})

describe(storySpy, () => {
  it('is a spy, chainable, outside of any story', () => {
    expect(useGreeting('Nuxt')).toBe('Hello Nuxt')
    expect(useGreeting).toHaveBeenCalledWith('Nuxt')
    expect(useGreeting.mockName('useGreeting')).toBe(useGreeting)
    expect(useGreeting.getMockName()).toBe('useGreeting')
    useGreeting.mockClear()
  })

  it('gives each story of a page its implementation and its calls', async () => {
    const storyA = begin()
    const storyB = begin()

    runHook(storyA, () => useGreeting.mockReturnValue('a'))
    runHook(storyB, () => useGreeting.mockReturnValue('b'))

    await expect(runHook(storyA, () => useGreeting('Nuxt'))).resolves.toBe('a')
    await expect(runHook(storyB, () => useGreeting('Nuxt'))).resolves.toBe('b')
    await runHook(storyB, () => useGreeting('Nuxt'))
    await runHook(storyA, () => expect(useGreeting).toHaveBeenCalledOnce())
    await runHook(storyB, () => expect(useGreeting).toHaveBeenCalledTimes(2))
  })

  it('keeps the story of a hook after its awaits, while other stories run', async () => {
    const storyA = begin()
    const storyB = begin()
    const configure = (story: Story, value: string) =>
      runHook(story, async () => {
        await awaitTick()
        useGreeting.mockReturnValue(value)
        await awaitTick()
        return useGreeting('Nuxt')
      })

    const greetings = await Promise.all([
      configure(storyA, 'a'),
      configure(storyB, 'b'),
    ])

    expect(greetings).toEqual(['a', 'b'])
  })

  it('throws for a spy configured where the story is unknown', async () => {
    const storyA = begin()
    begin()

    const configured = runHook(storyA, async () => {
      // An `await` the build does not see, such as in a helper
      await tick()
      useGreeting.mockReturnValue('a')
    })

    await expect(configured).rejects.toThrow(NuxtSpySharedOnDocsPageError)
    await expect(configured).rejects.toThrow(
      'The story of useGreeting.mockReturnValue() is unknown. Set parameters.docs.story.inline to false in the meta.',
    )
  })

  it('needs no context when the page has a single story', async () => {
    const story = begin()

    await runHook(story, async () => {
      await tick()
      useGreeting.mockReturnValue('a')
    })
    await tick()

    expect(useGreeting('Nuxt')).toBe('a')
    expect(useGreeting).toHaveBeenCalledOnce()
  })

  it('is called for the story whose Nuxt context is set', () => {
    const storyA = begin()
    const storyB = begin()
    const appA = {} as NuxtApp
    trackStoryApp(appA, storyA.canvasElement)
    runHook(storyA, () => useGreeting.mockReturnValue('a'))
    runHook(storyB, () => useGreeting.mockReturnValue('b'))
    context.app = appA

    expect(runInStoryContext(() => useGreeting('Nuxt'))).toBe('a')
  })

  it('is not configured for the story whose app boots meanwhile', async () => {
    begin()
    const booting = begin()
    const app = {} as NuxtApp
    trackStoryApp(app, booting.canvasElement)
    context.app = app

    await bootStory(async () => {
      expect(() => useGreeting.mockReturnValue('a')).toThrow(
        NuxtSpySharedOnDocsPageError,
      )
      expect(useGreeting('Nuxt')).toBe('Hello Nuxt')
    })

    await runHook(booting, () => expect(useGreeting).toHaveBeenCalledOnce())
  })

  it('is called for the story last interacted with, outside of any context', () => {
    const storyA = begin()
    const storyB = begin()
    const app = {} as NuxtApp
    mountStory(storyA, app)
    mountStory(storyB, app)
    runHook(storyA, () => useGreeting.mockReturnValue('a'))
    runHook(storyB, () => useGreeting.mockReturnValue('b'))

    storyA.canvasElement.dispatchEvent(new Event('click'))
    const clickedA = useGreeting('Nuxt')
    storyB.canvasElement.dispatchEvent(new Event('keydown'))
    const typedInB = useGreeting('Nuxt')

    expect([clickedA, typedInB]).toEqual(['a', 'b'])
    unmountStory(storyA)
    unmountStory(storyB)
  })

  it('throws when called where the story is unknown, once a story configured it', () => {
    const storyA = begin()
    begin()

    expect(useGreeting('Nuxt')).toBe('Hello Nuxt')
    runHook(storyA, () => useGreeting.mockReturnValue('a'))

    expect(() => useGreeting('Nuxt')).toThrow(NuxtSpySharedOnDocsPageError)
    expect(() => useGreeting('Nuxt')).toThrow('The story of useGreeting()')
    useGreeting.mockClear()
  })

  it('starts each story anew, in the same canvas', () => {
    const story = begin()
    runHook(story, () => useGreeting.mockReturnValue('a'))
    runHook(story, () => useGreeting('Nuxt'))

    cleanups.push(beginStorySpies(story.canvasElement))

    expect(useGreeting('Nuxt')).toBe('Hello Nuxt')
    expect(useGreeting).toHaveBeenCalledOnce()
  })

  it('forgets the stories of a docs page the user left', () => {
    const left = Object.assign(new EventTarget(), { isConnected: true })
    cleanups.push(beginStorySpies(left))
    begin()
    left.isConnected = false

    useGreeting.mockReturnValue('b')

    expect(useGreeting('Nuxt')).toBe('b')
  })
})

describe(inStoryContext, () => {
  it('wraps each hook of an array, and leaves alone what is not a hook', () => {
    const hooks = inStoryContext([() => 'a', 'b'])

    expect(hooks).toEqual([expect.any(Function), 'b'])
    expect(inStoryContext(undefined)).toBeUndefined()
  })

  it('keeps the source of the hook, where Storybook reads its parameters', () => {
    const play = async ({ mount }: { mount: () => void }) => mount()

    expect(String(inStoryContext(play))).toBe(String(play))
  })

  it('runs a hook without story context as it is', () => {
    const wrapped = inStoryContext((value: string) => value)

    expect(
      typeof wrapped === 'function' && Reflect.apply(wrapped, undefined, ['a']),
    ).toBe('a')
  })
})
