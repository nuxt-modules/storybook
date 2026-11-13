import { storyHooksPlugins } from '../packages/storybook-addon/src/node/plugins/story-hooks'
import {
  IN_STORY_CONTEXT,
  SPIES_RUNTIME,
  keepStoryContext,
  wrapStoryHooks,
} from '../packages/storybook-addon/src/node/story-hooks'

const FILE = '/app/components/A.stories.ts'

const IMPORT = `import { inStoryContext as ${IN_STORY_CONTEXT} } from "${SPIES_RUNTIME}";\n`

function wrapped(code: string) {
  return wrapStoryHooks(code, FILE)?.code.replace(IMPORT, '')
}

describe(wrapStoryHooks, () => {
  it('wraps a hook written as a function or as a reference', () => {
    expect(
      wrapped(
        `export const A = meta.story({ play: async ({ mount }) => {}, beforeEach: setUp })`,
      ),
    ).toBe(
      `export const A = meta.story({ play: ${IN_STORY_CONTEXT}(async ({ mount }) => {}), beforeEach: ${IN_STORY_CONTEXT}(setUp) })`,
    )
  })

  it('wraps a hook written as a method, or as a shorthand', () => {
    expect(
      wrapped(
        `export const A: Story = { async play({ canvas }) {}, beforeEach() {}, afterEach }`,
      ),
    ).toBe(
      `export const A: Story = { play: ${IN_STORY_CONTEXT}(async function ({ canvas }) {}), beforeEach: ${IN_STORY_CONTEXT}(function () {}), afterEach: ${IN_STORY_CONTEXT}(afterEach) }`,
    )
  })

  it('wraps each hook of an array', () => {
    expect(
      wrapped(`export default { loaders: [loadUser, async () => ({})] }`),
    ).toBe(
      `export default { loaders: [${IN_STORY_CONTEXT}(loadUser), ${IN_STORY_CONTEXT}(async () => ({}))] }`,
    )
  })

  it('leaves alone a destructured property named as a hook', () => {
    expect(wrapped(`const A = { play: ({ loaders, play }) => play() }`)).toBe(
      `const A = { play: ${IN_STORY_CONTEXT}(({ loaders, play }) => play()) }`,
    )
    expect(
      wrapStoryHooks(`const { play, beforeEach: setUp } = story`, FILE),
    ).toBeUndefined()
  })

  it('wraps the given hooks instead of the default ones', () => {
    expect(
      wrapStoryHooks(`const A = { setUp() {}, play() {} }`, FILE, ['setUp'])
        ?.code,
    ).toContain(`{ setUp: ${IN_STORY_CONTEXT}(function () {}), play() {} }`)
  })

  it('leaves alone a file without hook, and the other properties', () => {
    expect(
      wrapStoryHooks(`export const A = { args: {} }`, FILE),
    ).toBeUndefined()
    expect(
      wrapStoryHooks(`export const A = { ['play']: play, name: 'play' }`, FILE),
    ).toBeUndefined()
  })
})

describe(keepStoryContext, () => {
  it('restores the story context after the awaits of the wrapped hooks', () => {
    const hooks = wrapStoryHooks(
      `export const A = { async beforeEach() { await load(); useGreeting.mockReturnValue('a') } }`,
      FILE,
    )
    const code = keepStoryContext(hooks?.code ?? '', FILE)?.code

    expect(code).toContain(
      `;(([__temp,__restore]=__executeAsync(()=>load())),await __temp,__restore());; useGreeting.mockReturnValue('a')`,
    )
    expect(code).toContain(
      `import { executeStoryAsync as __executeAsync } from "${SPIES_RUNTIME}";`,
    )
  })

  it('leaves alone the awaits of the other functions', () => {
    expect(
      keepStoryContext(`async function setUp() { await load() }`, FILE),
    ).toBeUndefined()
  })
})

describe(storyHooksPlugins, () => {
  it('wraps the hooks of the scripts mocking an auto-import only', () => {
    const transform = storyHooksPlugins()[0]?.transform as Transform
    const story = `mockNuxtImport('useGreeting')\nexport const A = { beforeEach() {} }`

    expect(transform.call({}, story, FILE)?.code).toContain(
      `beforeEach: ${IN_STORY_CONTEXT}(function () {})`,
    )
    expect(transform.call({}, story, '/app/components/A.vue')).toBeUndefined()
    expect(
      transform.call({}, `export const A = { play() {} }`, FILE),
    ).toBeUndefined()
  })

  it('wraps the hooks it is given', () => {
    const transform = storyHooksPlugins(['setUp'])[0]?.transform as Transform
    const story = `mockNuxtImport('useGreeting')\nexport const A = { setUp() {}, play() {} }`

    expect(transform.call({}, story, FILE)?.code).toContain(
      `{ setUp: ${IN_STORY_CONTEXT}(function () {}), play() {} }`,
    )
  })
})

type Transform = (
  this: unknown,
  code: string,
  id: string,
) => { code: string } | undefined
