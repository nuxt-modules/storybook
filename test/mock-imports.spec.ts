import { resolve } from 'pathe'
import { runtimeDir } from '../packages/storybook-addon/src/dirs'
import type { MockedImport } from '../packages/storybook-addon/src/node/mock-calls'
import {
  MOCKED_IMPORTS_ID,
  SPY_MODULE_PREFIX,
  mockImportsPlugin,
} from '../packages/storybook-addon/src/node/plugins/mock-imports'

type ResolveId = (
  this: unknown,
  source: string,
  importer?: string,
) => Promise<string | undefined>

type Load = (this: unknown, id: string) => string | undefined

const ROUTER_SOURCE = '#app/composables/router'

const ROUTER_ID = '/app/node_modules/nuxt/dist/app/composables/router.js'

const MOCKED: MockedImport[] = [
  { as: 'useCounter', from: '/app/composables/a.ts', name: 'useCounter' },
  { as: 'useRoute', from: ROUTER_SOURCE, name: 'useRoute' },
  { as: 'useGreeting', from: '/app/composables/greeting.ts', name: 'default' },
  { as: 'useFoo', from: '/app/composables/useFoo/index.ts', name: 'useFoo' },
]

// Resolves the Nuxt alias and the `~` directory import like Vite would
const context = {
  resolve: (source: string) => ({
    external: false,
    id:
      source === ROUTER_SOURCE
        ? ROUTER_ID
        : source.replace(
            '~/composables/useFoo',
            '/app/composables/useFoo/index.ts',
          ),
  }),
}

async function startedPlugin(mocked = MOCKED) {
  const plugin = mockImportsPlugin(mocked)
  const buildStart = plugin.buildStart as (this: unknown) => Promise<void>
  await buildStart.call(context)
  return {
    load: plugin.load as Load,
    resolveId: plugin.resolveId as ResolveId,
  }
}

describe(mockImportsPlugin, () => {
  it('refuses a mocked module it cannot resolve', async () => {
    const plugin = mockImportsPlugin(MOCKED)
    const buildStart = plugin.buildStart as (this: unknown) => Promise<void>

    await expect(buildStart.call({ resolve: () => null })).rejects.toThrow(
      "Cannot resolve '/app/composables/a.ts'",
    )
  })

  it('redirects the imports of a mocked module to its spy module', async () => {
    const { resolveId } = await startedPlugin()

    await expect(
      resolveId.call(context, ROUTER_SOURCE, '/app/nuxt.js'),
    ).resolves.toBe(`${SPY_MODULE_PREFIX}${ROUTER_ID}?spies=useRoute`)
  })

  it('redirects a directory import of a mocked index module', async () => {
    const { resolveId } = await startedPlugin()

    await expect(
      resolveId.call(context, '~/composables/useFoo', '/app/A.vue'),
    ).resolves.toBe(
      `${SPY_MODULE_PREFIX}/app/composables/useFoo/index.ts?spies=useFoo`,
    )
  })

  it('keeps the version query of Vite in the spy module id', async () => {
    const { resolveId } = await startedPlugin()
    const versioned = {
      resolve: () => ({
        external: false,
        id: '/app/composables/a.ts?v=abc123',
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
      resolveId.call(
        context,
        ROUTER_SOURCE,
        `${SPY_MODULE_PREFIX}${ROUTER_ID}`,
      ),
    ).resolves.toBeUndefined()
  })

  it('exports the mocked names as spies and the rest as is', async () => {
    const { load } = await startedPlugin()

    expect(
      load.call({}, `${SPY_MODULE_PREFIX}${ROUTER_ID}?v=abc&spies=useRoute`),
    ).toMatchInlineSnapshot(`
      "import { fn } from "storybook/test";
      import { resolveMock } from "${resolve(runtimeDir, 'mocks')}";
      import * as original from "/app/node_modules/nuxt/dist/app/composables/router.js?v=abc";
      export * from "/app/node_modules/nuxt/dist/app/composables/router.js?v=abc";
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
      import * as original from "/app/composables/greeting.ts";
      export * from "/app/composables/greeting.ts";
      export default fn((...args) => resolveMock("useGreeting", original["default"])(...args)).mockName("useGreeting")
      "
    `)
  })

  it('serves the spies by name, and the mocked component names', async () => {
    const plugin = mockImportsPlugin(MOCKED.slice(0, 3), [
      {
        filePath: '/app/components/MyAvatar.vue',
        name: 'default',
        pascalName: 'MyAvatar',
        server: false,
      },
    ])
    const load = plugin.load as Load

    expect(load.call({}, MOCKED_IMPORTS_ID)).toMatchInlineSnapshot(`
      "import { useCounter as __useCounter } from "/app/composables/a.ts";
      import { useRoute as __useRoute } from "#app/composables/router";
      import { default as __useGreeting } from "/app/composables/greeting.ts";
      export const mockedImports = {
        useCounter: __useCounter,
        useRoute: __useRoute,
        useGreeting: __useGreeting
      }
      export const mockedComponents = ["MyAvatar"]
      "
    `)
  })
})
