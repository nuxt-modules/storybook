import { STORY_RENDER_PHASE_CHANGED } from 'storybook/internal/core-events'
import { addons } from 'storybook/preview-api'
import type { Mock } from 'storybook/test'


type Canvas = Pick<Node, 'isConnected'>

interface DocsRender {
  settingUp: boolean
  storyId: string
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

  constructor() {
    super(
      [
        // A docs page shows this line only, in a box that doesn't wrap it
        '[nuxt-storybook] Inline stories share the spies of mockNuxtImport. Set parameters.docs.story.inline to false in the meta.',
        '',
        'A story of this docs page configures the spy of a mocked auto-import',
        'in its setup, such as with `mockReturnValue` in a `beforeEach`.',
        'Inline stories render in one document, so every story would get the',
        'implementation set by the story that ran last.',
        '',
        'Render the stories of this file in iframes, where each story has its',
        'own spies. Add this to its meta:',
        '',
        '  parameters: { docs: { story: { inline: false } } }',
        '',
        'Or set the implementation with the factory of `mockNuxtImport`,',
        'which applies per story file and works inline.',
      ].join('\n'),
    )
  }
}

/**
 * Starts the setup of a story of a docs page. Throws when another story of
 * the page configured a spy. Returns the cleanup.
 */
export function startDocSetup(storyId: string, canvas: Canvas): () => void {
  listenForFailures()
  forgetRemovedRenders()
  if (configuredOnPage && hasOtherStory(storyId)) {
    throw new NuxtSpySharedOnDocsPageError()
  }
  renders.set(canvas, { settingUp: true, storyId })
  return () => {
    renders.delete(canvas)
    forgetRemovedRenders()
  }
}

export function endDocsSetup(canvas: Canvas): void {
  const render = renders.get(canvas)
  if (render) {
    render.settingUp = false
  }
}

export function failDocsSetup(storyId: string): void {
  for (const render of renders.values()) {
    if (render.storyId === storyId) {
      render.settingUp = false
    }
  }
}

/** Makes configuring `spy` during the setup of a docs page story count. */
export function trackConfiguration<T extends Mock>(spy: T): T {
  const tracked: T = new Proxy(spy, {
    get(target, key) {
      const value: unknown = Reflect.get(target, key)
      if (typeof value !== 'function') {
        return value
      }
      return (...args: unknown[]) => {
        if (CONFIGURING.has(key)) {
          noteConfiguration()
        }
        // Chained calls stay tracked
        const result: unknown = Reflect.apply(value, target, args)
        return result === target ? tracked : result
      }
    },
  })
  return tracked
}

// The stories rendering on the docs page, by canvas: the primary story and
// Its copy in the list of stories are two renders of one story
const renders = new Map<Canvas, DocsRender>()

let configuredOnPage = false

let listening = false

function noteConfiguration(): void {
  forgetRemovedRenders()
  const stories = [...renders.values()]
  if (!stories.some((render) => render.settingUp)) {
    return
  }
  if (new Set(stories.map((render) => render.storyId)).size > 1) {
    throw new NuxtSpySharedOnDocsPageError()
  }
  configuredOnPage = true
}

function hasOtherStory(storyId: string): boolean {
  return [...renders.values()].some((render) => render.storyId !== storyId)
}

// Storybook skips the cleanup of a story whose `beforeEach` threw, and removes
// Its canvas when the user leaves the page
function forgetRemovedRenders(): void {
  for (const canvas of renders.keys()) {
    if (!canvas.isConnected) {
      renders.delete(canvas)
    }
  }
  if (renders.size === 0) {
    configuredOnPage = false
  }
}

// A story failing in a `beforeEach` never mounts, and stays on the page with
// Its error: its setup ends there
function listenForFailures(): void {
  if (listening) {
    return
  }
  listening = true
  addons
    .getChannel()
    .on(
      STORY_RENDER_PHASE_CHANGED,
      ({ newPhase, storyId }: { newPhase: string; storyId: string }) => {
        if (newPhase === 'errored') {
          failDocsSetup(storyId)
        }
      },
    )
}
