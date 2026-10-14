import { resolve } from 'pathe'
import { runtimeDir } from '../packages/storybook-addon/src/dirs'
import {
  MOCKED_IMPORTS_ID,
  mockImportsPlugin,
} from '../packages/storybook-addon/src/node/plugins/mock-imports'
import type { MockedImport } from '../packages/storybook-addon/src/node/plugins/mock-imports'

type ResolveId = (
  this: unknown,
  source: string,
  importer?: string,
) => Promise<string | undefined>

type Load = (this: unknown, id: string) => string | undefined

type Transform = (
  this: unknown,
  code: string,
  id: string,
) => { code: string } | undefined

const MOCKED: MockedImport[] = [
  { as: 'useCounter', from: '/app/composables/a.ts', name: 'useCounter' },
  { as: 'useRoute', from: '#app/composables/router', name: 'useRoute' },
]

const STORY_FILE = `${process.cwd()}/components/A.stories.ts`

// Resolves `#app/composables/router` like the Nuxt alias would
const context = {
  resolve: (source: string) => ({
    id: source.replace('#app', '/app/node_modules/nuxt/dist/app'),
    external: false,
  }),
}

async function startedPlugin() {
  const plugin = mockImportsPlugin({
    imports: MOCKED,
    storyFiles: [STORY_FILE],
  })
  const buildStart = plugin.buildStart as (this: unknown) => Promise<void>
  await buildStart.call(context)
  return plugin
}

describe(mockImportsPlugin, () => {
  it('leaves the imports of other modules alone', async () => {
    const plugin = await startedPlugin()
    const resolveId = plugin.resolveId as ResolveId

    await expect(
      resolveId.call(context, '/app/other.ts', '/app/components/A.vue'),
    ).resolves.toBeUndefined()
  })

  it('redirects the imports of a mocked module to its spy module', async () => {
    const plugin = await startedPlugin()
    const resolveId = plugin.resolveId as ResolveId

    await expect(
      resolveId.call(context, '#app/composables/router', '/app/nuxt.js'),
    ).resolves.toBe(
      '\0nuxt-storybook-spy:/app/node_modules/nuxt/dist/app/composables/router?spies=useRoute',
    )
  })

  it('keeps the version query of Vite in the spy module id', async () => {
    const plugin = await startedPlugin()
    const resolveId = plugin.resolveId as ResolveId
    const versioned = {
      resolve: () => ({
        id: '/app/composables/a.ts?v=abc123',
        external: false,
      }),
    }

    await expect(
      resolveId.call(versioned, '/app/composables/a.ts', '/app/A.vue'),
    ).resolves.toBe(
      '\0nuxt-storybook-spy:/app/composables/a.ts?v=abc123&spies=useCounter',
    )
  })

  it('exports the mocked names as spies and the rest as is', async () => {
    const plugin = await startedPlugin()
    const load = plugin.load as Load

    expect(
      load.call(
        {},
        '\0nuxt-storybook-spy:/app/composables/a.ts?spies=useCounter',
      ),
    ).toBe(
      `import { fn } from 'storybook/test'
import { resolveMock } from ${JSON.stringify(resolve(runtimeDir, 'mocks'))}
import * as original from "/app/composables/a.ts?nuxt-storybook-original"
export * from "/app/composables/a.ts?nuxt-storybook-original"
export default original.default
export const useCounter = fn((...args) => resolveMock("useCounter", original["useCounter"])(...args)).mockName("useCounter")
`,
    )
  })

  it('serves the spies by name', async () => {
    const plugin = await startedPlugin()
    const load = plugin.load as Load

    expect(load.call({}, MOCKED_IMPORTS_ID)).toBe(
      `import { useCounter as __0 } from "/app/composables/a.ts"
import { useRoute as __1 } from "#app/composables/router"
export const mockedImports = { "useCounter": __0, "useRoute": __1 }
`,
    )
  })

  it('tells the calls of a story file which file they are in', async () => {
    const plugin = await startedPlugin()
    const transform = plugin.transform as Transform

    expect(
      transform.call({}, `mockNuxtImport('useCounter', factory)\n`, STORY_FILE)
        ?.code,
    ).toBe(
      `mockNuxtImport('useCounter', factory, "./components/A.stories.ts")\n`,
    )
    expect(
      transform.call(
        {},
        `mockNuxtImport('useCounter', factory)\n`,
        '/elsewhere.ts',
      ),
    ).toBeUndefined()
  })
})
