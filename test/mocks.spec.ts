// @vitest-environment node

import type { NuxtApp } from '#app/nuxt'
import {
  applyStoryMocks,
  beginStoryMocks,
  mockStoryComponent,
  mockStoryImport,
  registerFileComponentMock,
  registerFileMock,
  resolveMock,
  resolveMockedComponent,
} from '../packages/storybook-addon/src/runtime/mocks/registry'
import { inStoryContext } from '../packages/storybook-addon/src/runtime/mocks/story-spies'
import {
  NuxtMocksSharedOnDocsPageError,
  mountStory,
  runInStoryContext,
  unmountStory,
} from '../packages/storybook-addon/src/runtime/story/context'

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

// The app of the Nuxt context, the latest booted one in the preview
const context = vi.hoisted(() => {
  const current: { app: NuxtApp | null } = { app: null }
  return current
})

vi.mock(nuxtApp, () => ({ tryUseNuxtApp: () => context.app }))

const appA = {} as NuxtApp
const appB = {} as NuxtApp

const storyA = {
  canvasElement: new EventTarget(),
  importPath: './a.stories.ts',
}
const storyB = {
  canvasElement: new EventTarget(),
  importPath: './b.stories.ts',
}

const useGreeting = () => 'original'

/** Begins a story and creates its app, like the preview does. */
async function boot(story: typeof storyA, app: NuxtApp, guards = {}) {
  await beginStoryMocks(story.canvasElement, story.importPath, guards)
  await applyStoryMocks(app, story.canvasElement)
}

/** Runs `run` like a hook written in the story file of `story`. */
function inHook<T>(story: typeof storyA, run: () => T): Promise<T> {
  const hook = inStoryContext(run) as (context: object) => Promise<T>
  return hook(story)
}

beforeAll(async () => {
  registerFileMock(storyA.importPath, 1, 'useGreeting', () => () => 'a')
  registerFileMock(storyB.importPath, 1, 'useGreeting', () => () => 'b')
  await boot(storyA, appA)
  await boot(storyB, appB)
})

beforeEach(() => {
  context.app = appB
})

afterEach(() => {
  unmountStory(storyA)
  unmountStory(storyB)
})

describe(resolveMock, () => {
  it('throws outside of the Nuxt context on a docs page mixing story files, before any interaction', () => {
    mountStory(storyA, appA)
    mountStory(storyB, appB)

    expect(() => resolveMock('useGreeting', useGreeting)).toThrow(
      NuxtMocksSharedOnDocsPageError,
    )
    expect(() => resolveMock('useGreeting', useGreeting)).toThrow(
      /useGreeting\(\).*parameters: \{ docs: \{ story: \{ inline: false \} \} \}/,
    )
  })

  it('resolves to the story last interacted with', () => {
    mountStory(storyA, appA)
    mountStory(storyB, appB)

    storyA.canvasElement.dispatchEvent(new Event('pointerdown'))
    expect(resolveMock('useGreeting', useGreeting)()).toBe('a')

    storyB.canvasElement.dispatchEvent(new Event('keydown'))
    expect(resolveMock('useGreeting', useGreeting)()).toBe('b')
  })

  it('forgets an interaction once its story unmounts', () => {
    mountStory(storyA, appA)
    mountStory(storyB, appB)
    storyA.canvasElement.dispatchEvent(new Event('click'))
    unmountStory(storyA)
    mountStory(storyA, appA)

    expect(() => resolveMock('useGreeting', useGreeting)).toThrow(
      NuxtMocksSharedOnDocsPageError,
    )
  })

  it('uses the Nuxt context when the stories come from a single file', () => {
    const otherA = { ...storyA, canvasElement: new EventTarget() }
    mountStory(storyA, appA)
    mountStory(otherA, appA)
    context.app = appA

    expect(resolveMock('useGreeting', useGreeting)()).toBe('a')
    unmountStory(otherA)
  })

  it('uses the Nuxt context inside of it, whatever the interaction', () => {
    mountStory(storyA, appA)
    mountStory(storyB, appB)
    storyA.canvasElement.dispatchEvent(new Event('pointerdown'))

    expect(
      runInStoryContext(() => resolveMock('useGreeting', useGreeting))(),
    ).toBe('b')
  })
})

describe('mocks of a story', () => {
  const story = {
    canvasElement: new EventTarget(),
    importPath: './c.stories.ts',
  }

  it('runs a factory once, when the story file loads, and awaits it', async () => {
    const factory = vi.fn<() => Promise<() => string>>(async () => () => 'file')
    registerFileMock(story.importPath, 1, 'useGreeting', factory)
    await beginStoryMocks(story.canvasElement, story.importPath)
    await beginStoryMocks(new EventTarget(), story.importPath)

    expect(factory).toHaveBeenCalledOnce()
    // Before the app of the story exists
    await expect(
      inHook(story, () => resolveMock('useGreeting', useGreeting)()),
    ).resolves.toBe('file')
  })

  it('mocks an import and a component in a hook, for its story only', async () => {
    registerFileComponentMock(story.importPath, 1, 'MyAvatar', { name: 'File' })
    await beginStoryMocks(story.canvasElement, story.importPath)
    await inHook(story, () => {
      mockStoryImport('useGreeting', () => () => 'hook')
      mockStoryComponent('MyAvatar', async () => ({ name: 'Hook' }))
    })
    const app = {} as NuxtApp
    await applyStoryMocks(app, story.canvasElement)

    await expect(
      inHook(story, () => resolveMock('useGreeting', useGreeting)()),
    ).resolves.toBe('hook')
    expect(resolveMockedComponent(app, 'MyAvatar')).toStrictEqual({
      name: 'Hook',
    })
    await expect(
      inHook(story, () => mockStoryComponent('MyAvatar', { name: 'Late' })),
    ).rejects.toThrow('was called after its story rendered')

    await boot(story, app)

    expect(resolveMockedComponent(app, 'MyAvatar')).toStrictEqual({
      name: 'File',
    })
  })

  it('refuses a mock outside of a story hook', () => {
    expect(() => mockStoryImport('useGreeting', () => () => 'lost')).toThrow(
      "The story of mockNuxtImport('useGreeting') is unknown",
    )
  })

  it('guards the original of an import no factory mocks', async () => {
    const guarded = { ...story, importPath: './d.stories.ts' }
    await beginStoryMocks(guarded.canvasElement, guarded.importPath, {
      useGreeting: (original: () => string) => () => `guarded ${original()}`,
    })

    await expect(
      inHook(guarded, () => resolveMock('useGreeting', useGreeting)()),
    ).resolves.toBe('guarded original')
  })
})
