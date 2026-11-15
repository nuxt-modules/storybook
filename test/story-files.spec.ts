import { FILE_CALLS_RUNTIME } from '../packages/storybook-addon/src/node/mocks/calls'
import { storyFilesPlugin } from '../packages/storybook-addon/src/node/mocks/plugins/story-files'

type Transform = (
  this: unknown,
  code: string,
  id: string,
) => { code: string } | undefined

const STORY_FILE = `${process.cwd()}/components/A.stories.ts`

const IMPORT = `import * as __nuxtStorybookFile from "${FILE_CALLS_RUNTIME}";\n`

describe(storyFilesPlugin, () => {
  it('tells the calls of a script which file they are in, counting the transforms', () => {
    const transform = storyFilesPlugin().transform as Transform
    const code = `mockNuxtImport('useCounter', factory)\nmockComponent('MyAvatar', factory)\n`

    expect(transform.call({}, code, STORY_FILE)?.code).toBe(
      `${IMPORT}__nuxtStorybookFile.mockNuxtImport("./components/A.stories.ts", 1, 'useCounter', factory)\n__nuxtStorybookFile.mockComponent("./components/A.stories.ts", 1, 'MyAvatar', factory)\n`,
    )
    expect(transform.call({}, code, `${STORY_FILE}?t=123`)?.code).toBe(
      `${IMPORT}__nuxtStorybookFile.mockNuxtImport("./components/A.stories.ts", 2, 'useCounter', factory)\n__nuxtStorybookFile.mockComponent("./components/A.stories.ts", 2, 'MyAvatar', factory)\n`,
    )
    expect(transform.call({}, 'const x = 1\n', STORY_FILE)).toBeUndefined()
    expect(transform.call({}, code, '/app/components/A.vue')).toBeUndefined()
  })
})
