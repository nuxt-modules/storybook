import { resolve } from 'pathe'
import { runtimeDir } from '../packages/storybook-addon/src/dirs'
import {
  MOCKED_IMPORTS_ID,
  SPY_MODULE_PREFIX,
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

const ROUTER_SOURCE = '#app/composables/router'

const ROUTER_ID = '/app/node_modules/nuxt/dist/app/composables/router.js'

const MOCKED: MockedImport[] = [
  { as: 'useCounter', from: '/app/composables/a.ts', name: 'useCounter' },
  { as: 'useRoute', from: ROUTER_SOURCE, name: 'useRoute' },
  { as: 'useGreeting', from: '/app/composables/greeting.ts', name: 'default' },
]

const STORY_FILE = `${process.cwd()}/components/A.stories.ts`

// Resolves the Nuxt alias like Vite would, everything else as is
const context = {
  resolve: (source: string) => ({
    id: source === ROUTER_SOURCE ? ROUTER_ID : source,
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
  return {
    load: plugin.load as Load,
    resolveId: plugin.resolveId as ResolveId,
    transform: plugin.transform as Transform,
  }
}

describe(mockImportsPlugin, () => {
  it('redirects the imports of a mocked module to its spy module', async () => {
    const { resolveId } = await startedPlugin()

    await expect(
      resolveId.call(context, ROUTER_SOURCE, '/app/nuxt.js'),
    ).resolves.toBe(`${SPY_MODULE_PREFIX}${ROUTER_ID}?spies=useRoute`)
  })

  it('keeps the version query of Vite in the spy module id', async () => {
    const { resolveId } = await startedPlugin()
    const versioned = {
      resolve: () => ({
        id: '/app/composables/a.ts?v=abc123',
        external: false,
      }),
    }

    await expect(
      resolveId.call(versioned, '/app/composables/a.ts', '/app/A.vue'),
    ).resolves.toBe(
      `${SPY_MODULE_PREFIX}/app/composables/a.ts?v=abc123&spies=useCounter`,
    )
  })

  it('leaves the other modules and the originals alone', async () => {
    const { resolveId } = await startedPlugin()

    await expect(
      resolveId.call(context, '/app/other.ts', '/app/components/A.vue'),
    ).resolves.toBeUndefined()
    await expect(
      resolveId.call(context, `${ROUTER_ID}?nuxt-storybook-original`, '/x.js'),
    ).resolves.toBe(`${ROUTER_ID}?nuxt-storybook-original`)
  })

  it('exports the mocked names as spies and the rest as is', async () => {
    const { load } = await startedPlugin()

    expect(
      load.call({}, `${SPY_MODULE_PREFIX}${ROUTER_ID}?v=abc&spies=useRoute`),
    ).toMatchInlineSnapshot(`
      "import { fn } from "storybook/test";
      import { resolveMock } from "${resolve(runtimeDir, 'mocks')}";
      import * as original from "/app/node_modules/nuxt/dist/app/composables/router.js?v=abc&nuxt-storybook-original";
      export * from "/app/node_modules/nuxt/dist/app/composables/router.js?v=abc&nuxt-storybook-original";
      export default original.default
      export const useRoute = fn((...args) => resolveMock("useRoute", original["useRoute"])(...args)).mockName("useRoute")
      "
    `)
  })

  it('spies a default export through the default line', async () => {
    const { load } = await startedPlugin()

    expect(
      load.call(
        {},
        `${SPY_MODULE_PREFIX}/app/composables/greeting.ts?spies=useGreeting`,
      ),
    ).toMatchInlineSnapshot(`
      "import { fn } from "storybook/test";
      import { resolveMock } from "${resolve(runtimeDir, 'mocks')}";
      import * as original from "/app/composables/greeting.ts?nuxt-storybook-original";
      export * from "/app/composables/greeting.ts?nuxt-storybook-original";
      export default fn((...args) => resolveMock("useGreeting", original["default"])(...args)).mockName("useGreeting")
      "
    `)
  })

  it('serves the spies by name', async () => {
    const { load } = await startedPlugin()

    expect(load.call({}, MOCKED_IMPORTS_ID)).toMatchInlineSnapshot(`
      "import { useCounter as __useCounter } from "/app/composables/a.ts";
      import { useRoute as __useRoute } from "#app/composables/router";
      import { default as __useGreeting } from "/app/composables/greeting.ts";
      export const mockedImports = {
        useCounter: __useCounter,
        useRoute: __useRoute,
        useGreeting: __useGreeting
      }
      "
    `)
  })

  it('tells the calls of a story file which file they are in', async () => {
    const { transform } = await startedPlugin()

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
