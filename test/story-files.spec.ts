import { storyFilesPlugin } from '../packages/storybook-addon/src/node/plugins/story-files'

type Transform = (
  this: unknown,
  code: string,
  id: string,
) => { code: string } | undefined

const STORY_FILE = `${process.cwd()}/components/A.stories.ts`

describe(storyFilesPlugin, () => {
  it('tells the calls of a script which file they are in, counting the transforms', () => {
    const transform = storyFilesPlugin().transform as Transform
    const code = `mockNuxtImport('useCounter', factory)\nmockComponent('MyAvatar', factory)\n`

    expect(transform.call({}, code, STORY_FILE)?.code).toBe(
      `mockNuxtImport('useCounter', factory, "./components/A.stories.ts", 1)\nmockComponent('MyAvatar', factory, "./components/A.stories.ts", 1)\n`,
    )
    expect(transform.call({}, code, `${STORY_FILE}?t=123`)?.code).toBe(
      `mockNuxtImport('useCounter', factory, "./components/A.stories.ts", 2)\nmockComponent('MyAvatar', factory, "./components/A.stories.ts", 2)\n`,
    )
    expect(transform.call({}, 'const x = 1\n', STORY_FILE)).toBeUndefined()
    expect(transform.call({}, code, '/app/components/A.vue')).toBeUndefined()
  })
})
