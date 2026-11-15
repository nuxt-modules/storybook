import { tryUseNuxtApp } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'
import { getCurrentInstance } from 'vue'

interface MountedStory {
  canvasElement: EventTarget
  importPath: string
}

// The events telling which story the user acts on, from pointer or keyboard
const INTERACTION_EVENTS = [
  'pointerdown',
  'mousedown',
  'touchstart',
  'keydown',
  'focusin',
  'click',
]

export class NuxtMocksSharedOnDocsPageError extends Error {
  override name = 'NuxtMocksSharedOnDocsPageError'

  constructor(call: string) {
    super(
      `[nuxt-storybook] ${call} ran outside of the Nuxt context before any interaction, on a docs page rendering stories of several story files inline: the story whose mocks and endpoints apply is unknown. ` +
        'Add `parameters: { docs: { story: { inline: false } } }` to the meta of these story files, ' +
        'or make the call during the component setup.',
    )
  }
}

/** Tracks a mounted story, and the user events on its canvas. */
export function mountStory(story: MountedStory, nuxt: NuxtApp): void {
  const interact = () => {
    lastInteracted = story
  }
  for (const event of INTERACTION_EVENTS) {
    // Capture runs before the handlers of the story, which then resolve to it
    story.canvasElement.addEventListener(event, interact, true)
  }
  mountedStories.set(story, {
    nuxt,
    unlisten: () => {
      for (const event of INTERACTION_EVENTS) {
        story.canvasElement.removeEventListener(event, interact, true)
      }
    },
  })
}

export function unmountStory(story: MountedStory): void {
  mountedStories.get(story)?.unlisten()
  mountedStories.delete(story)
  if (lastInteracted === story) {
    lastInteracted = undefined
  }
}

/** Tells which canvas the story of a Nuxt app renders in. */
export function trackStoryApp(nuxt: NuxtApp, canvas: EventTarget): void {
  appCanvases.set(nuxt, canvas)
}

export function contextCanvas(options: {
  booting: boolean
}): EventTarget | undefined {
  const inContext = contextDepth > 0 || getCurrentInstance() !== null
  if (!inContext && !(options.booting && booting > 0)) {
    return undefined
  }
  const nuxt = tryUseNuxtApp()
  return nuxt ? appCanvases.get(nuxt) : undefined
}

export function lastInteractedCanvas(): EventTarget | undefined {
  return lastInteracted?.canvasElement
}

/** Runs `fn`, telling that the Nuxt context is set until it returns. */
export function runInStoryContext<T>(fn: () => T): T {
  contextDepth++
  try {
    return fn()
  } finally {
    contextDepth--
  }
}

export async function bootStory<T>(boot: () => Promise<T>): Promise<T> {
  booting++
  try {
    return await boot()
  } finally {
    booting--
  }
}

/**
 * The Nuxt app of the calling story.
 *
 * @throws {NuxtMocksSharedOnDocsPageError} When the story context is ambiguous and no last interacted story is available.
 */
export function resolveStoryNuxtApp(call: string): NuxtApp | undefined {
  if (!spansFilesOutOfContext()) {
    return tryUseNuxtApp() ?? undefined
  }
  if (lastInteracted) {
    return mountedStories.get(lastInteracted)?.nuxt
  }
  throw new NuxtMocksSharedOnDocsPageError(call)
}

/** Tells whether `resolveStoryNuxtApp` throws. */
export function isStoryContextAmbiguous(): boolean {
  return lastInteracted === undefined && spansFilesOutOfContext()
}

const mountedStories = new Map<
  MountedStory,
  { nuxt: NuxtApp; unlisten: () => void }
>()

const appCanvases = new WeakMap<NuxtApp, EventTarget>()

let lastInteracted: MountedStory | undefined

let contextDepth = 0

// Apps boot one at a time, so the default context is the booting one
let booting = 0

function spansFilesOutOfContext(): boolean {
  if (mountedStories.size < 2 || contextDepth > 0 || booting > 0) {
    return false
  }
  return getCurrentInstance() === null && spansFiles()
}

function spansFiles(): boolean {
  const [first, ...others] = mountedStories.keys()
  return others.some((story) => story.importPath !== first?.importPath)
}
