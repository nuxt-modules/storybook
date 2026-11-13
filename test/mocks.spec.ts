// @vitest-environment node

import type { NuxtApp } from '#app/nuxt'
import {
  applyFileMocks,
  registerFileMock,
  resolveMock,
} from '../packages/storybook-addon/src/runtime/mocks'
import {
  NuxtMocksSharedOnDocsPageError,
  mountStory,
  runInStoryContext,
  unmountStory,
} from '../packages/storybook-addon/src/runtime/story-context'

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

beforeAll(async () => {
  registerFileMock(storyA.importPath, 1, 'useGreeting', () => () => 'a')
  registerFileMock(storyB.importPath, 1, 'useGreeting', () => () => 'b')
  await applyFileMocks(appA, storyA.importPath)
  await applyFileMocks(appB, storyB.importPath)
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
