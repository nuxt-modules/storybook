import { fn, mocks } from 'storybook/test'
import { createContext, executeAsync } from 'unctx'
import type { Mock } from 'storybook/test'
import type { Procedure } from './mocks'
import { contextCanvas, lastInteractedCanvas } from './story-context'

/*
 * A mocked auto-import is one module for the whole preview, but each story
 * gets its own spy of it: the export is a proxy, forwarding to the spy of the
 * story it is used from. A story is known by its canvas:
 * - in a `beforeEach`, `play`, `loaders` or `afterEach` of a story file, which
 *   the build wraps with `inStoryContext`
 * - in the Nuxt context of the story: its setup, render, plugins...
 * - when it is the only story of the page
 * - when it is the story the user last interacted with
 */

interface StorySpies {
  /** The names of the spies the story configured. */
  configured: Set<string>
}

const CONFIGURING = new Set<PropertyKey>([
  'mockImplementation',
  'mockImplementationOnce',
  'mockRejectedValue',
  'mockRejectedValueOnce',
  'mockResolvedValue',
  'mockResolvedValueOnce',
  'mockReturnThis',
  'mockReturnValue',
  'mockReturnValueOnce',
  'withImplementation',
])

export class NuxtSpySharedOnDocsPageError extends Error {
  override name = 'NuxtSpySharedOnDocsPageError'

  constructor(call: string) {
    super(
      [
        // A docs page shows this line only, in a box that doesn't wrap it
        `[nuxt-storybook] The story of ${call} is unknown. Set parameters.docs.story.inline to false in the meta.`,
        '',
        'Each story has its own spy of a mocked auto-import. On a docs page',
        'rendering several stories inline, the story is known in the hooks',
        'written in the story file (`beforeEach`, `play`, `loaders`), during',
        'the component setup and render, and after an interaction with a',
        'story. This call ran somewhere else, such as in a helper after an',
        '`await`, or in a timer before any interaction.',
        '',
        'Render the stories of this file in iframes, where each story is',
        'alone. Add this to its meta:',
        '',
        '  parameters: { docs: { story: { inline: false } } }',
      ].join('\n'),
    )
  }
}

/** Starts a story with spies of its own. Returns the cleanup. */
export function beginStorySpies(canvas: EventTarget): () => void {
  const story: StorySpies = { configured: new Set() }
  stories.set(canvas, story)
  return () => {
    if (stories.get(canvas) === story) {
      stories.delete(canvas)
    }
  }
}

/**
 * Wraps a story hook, or each hook of an array, to run in the context of its
 * story. The build adds it to the hooks written in a story file.
 */
export function inStoryContext(hooks: unknown): unknown {
  if (Array.isArray(hooks)) {
    return hooks.map((hook: unknown) => inStoryContext(hook))
  }
  if (typeof hooks !== 'function') {
    return hooks
  }
  const hook = hooks
  function storyHook(this: unknown, ...args: unknown[]): unknown {
    const run = (): unknown => Reflect.apply(hook, this, args)
    const canvas = canvasOf(args[0])
    return canvas ? runInCanvas(canvas, run) : run()
  }
  // Storybook reads the parameters of `play` from its source, to find `mount`
  storyHook.toString = () => hook.toString()
  return storyHook
}

/**
 * Runs the expression of an `await` of a story hook, and gives what restores
 * the story context after it. The build wraps each `await` with it.
 */
export function executeStoryAsync<T>(
  run: () => Promise<T>,
): [Promise<T>, () => void] {
  const execution = executeAsync(run)
  // Other stories run during the `await`
  hookContext.unset()
  return execution
}

/** The spy of a mocked auto-import: a proxy over one spy per story. */
export function storySpy<T extends Procedure>(
  name: string,
  implementation: T,
): Mock<T> {
  const create = () => fn(implementation).mockName(name)
  const global = create()
  const spies = new WeakMap<StorySpies, Mock<T>>()

  const spyOf = (canvas: EventTarget | undefined): Mock<T> => {
    const story = canvas && storyOf(canvas)
    if (!story) {
      return global
    }
    let spy = spies.get(story)
    if (!spy) {
      spy = create()
      // Not reset by the other stories of the page: each story starts anew
      mocks.delete(spy)
      spies.set(story, spy)
    }
    return spy
  }

  const configuredSpy = (method: PropertyKey): Mock<T> => {
    const canvas = currentCanvas('access')
    if (!canvas && stories.size > 1) {
      throw new NuxtSpySharedOnDocsPageError(`${name}.${String(method)}()`)
    }
    if (canvas) {
      storyOf(canvas).configured.add(name)
    }
    return spyOf(canvas)
  }

  // Not the global spy itself: a proxy has to give the own read-only
  // Properties of its target as they are, and `mock` is one of them
  const facade: Mock<T> = Object.setPrototypeOf(() => undefined, global)

  const spy: Mock<T> = new Proxy(facade, {
    apply(_facade, self, args) {
      const canvas = currentCanvas('call')
      // The stories all have the same spy, unless one configured it
      if (!canvas && isConfigured(name)) {
        throw new NuxtSpySharedOnDocsPageError(`${name}()`)
      }
      return Reflect.apply(spyOf(canvas), self, args)
    },
    get(_facade, key) {
      const value: unknown = Reflect.get(spyOf(currentCanvas('access')), key)
      if (typeof value !== 'function') {
        return value
      }
      return (...args: unknown[]) => {
        const target = CONFIGURING.has(key)
          ? configuredSpy(key)
          : spyOf(currentCanvas('access'))
        const method: unknown = Reflect.get(target, key)
        const result: unknown =
          typeof method === 'function'
            ? Reflect.apply(method, target, args)
            : undefined
        // Chained calls stay on the proxy
        return result === target ? spy : result
      }
    },
  })
  return spy
}

const hookContext = createContext<EventTarget>()

// The stories of the page, by canvas: the primary story of a docs page and
// Its copy in the list of stories are two of them
const stories = new Map<EventTarget, StorySpies>()

function storyOf(canvas: EventTarget): StorySpies {
  let story = stories.get(canvas)
  if (!story) {
    story = { configured: new Set() }
    stories.set(canvas, story)
  }
  return story
}

// A call of the spy is likely to come from the app booting, if any, which
// `resolveMock` picks the implementation of. Its configuration is not.
function currentCanvas(use: 'access' | 'call'): EventTarget | undefined {
  forgetRemovedStories()
  const canvas =
    hookContext.tryUse() ?? contextCanvas({ booting: use === 'call' })
  if (canvas) {
    return canvas
  }
  if (stories.size === 1) {
    const [only] = stories.keys()
    return only
  }
  return lastInteractedCanvas()
}

function isConfigured(name: string): boolean {
  return [...stories.values()].some((story) => story.configured.has(name))
}

// Storybook skips the cleanup of a story whose `beforeEach` threw, and removes
// Its canvas when the user leaves the page
function forgetRemovedStories(): void {
  for (const canvas of stories.keys()) {
    if ('isConnected' in canvas && canvas.isConnected === false) {
      stories.delete(canvas)
    }
  }
}

function canvasOf(context: unknown): EventTarget | undefined {
  if (
    typeof context === 'object' &&
    context !== null &&
    'canvasElement' in context &&
    context.canvasElement instanceof EventTarget
  ) {
    return context.canvasElement
  }
}

async function runInCanvas(
  canvas: EventTarget,
  run: () => unknown,
): Promise<unknown> {
  try {
    return await hookContext.callAsync(canvas, run)
  } finally {
    if (hookContext.tryUse() === canvas) {
      hookContext.unset()
    }
  }
}
