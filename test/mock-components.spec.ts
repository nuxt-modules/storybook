import { resolve } from 'pathe'
import { runtimeDir } from '../packages/storybook-addon/src/dirs'
import type { MockedComponent } from '../packages/storybook-addon/src/node/mock-calls'
import {
  COMPONENT_MODULE_PREFIX,
  mockComponentsPlugin,
} from '../packages/storybook-addon/src/node/plugins/mock-components'

type ResolveId = (
  this: unknown,
  source: string,
  importer?: string,
) => Promise<string | undefined>

type Load = (this: unknown, id: string) => string | undefined

const AVATAR = '/app/components/MyAvatar.vue'

const LINK_SOURCE = '/app/node_modules/nuxt/dist/app/components/nuxt-link'

const SERVER_SOURCE =
  '/app/node_modules/nuxt/dist/components/runtime/server-component'

const MOCKED: MockedComponent[] = [
  { filePath: AVATAR, name: 'default', pascalName: 'MyAvatar', server: false },
  {
    filePath: LINK_SOURCE,
    name: 'default',
    pascalName: 'NuxtLink',
    server: false,
  },
  {
    filePath: '/app/components/MyChart.server.vue',
    name: 'default',
    pascalName: 'MyChart',
    server: true,
  },
]

// Adds the extension Vite would resolve
const context = {
  resolve: (source: string) => ({
    external: false,
    id: source.endsWith('.vue') ? source : `${source}.js`,
  }),
}

const wrapperId = (id: string) =>
  `${COMPONENT_MODULE_PREFIX}${encodeURIComponent(id)}`

async function startedPlugin(mocked = MOCKED) {
  const plugin = mockComponentsPlugin(mocked, SERVER_SOURCE)
  const buildStart = plugin.buildStart as (this: unknown) => Promise<void>
  await buildStart.call(context)
  return { load: plugin.load as Load, resolveId: plugin.resolveId as ResolveId }
}

describe(mockComponentsPlugin, () => {
  it('refuses a component file it cannot resolve', async () => {
    const plugin = mockComponentsPlugin(MOCKED, SERVER_SOURCE)
    const buildStart = plugin.buildStart as (this: unknown) => Promise<void>

    await expect(buildStart.call({ resolve: () => null })).rejects.toThrow(
      `Cannot resolve '${AVATAR}'`,
    )
  })

  it('redirects the imports of a mocked component to its wrapper', async () => {
    const { resolveId } = await startedPlugin()

    await expect(resolveId.call(context, AVATAR, '/app/A.vue')).resolves.toBe(
      wrapperId(AVATAR),
    )
    await expect(
      resolveId.call(context, LINK_SOURCE, '/app/A.vue'),
    ).resolves.toBe(wrapperId(`${LINK_SOURCE}.js`))
  })

  it('redirects the island factory when a server component is mocked', async () => {
    const { resolveId } = await startedPlugin()

    await expect(
      resolveId.call(context, SERVER_SOURCE, '/app/A.vue'),
    ).resolves.toBe(wrapperId(`${SERVER_SOURCE}.js`))
    const { resolveId: withoutServer } = await startedPlugin(MOCKED.slice(0, 2))
    await expect(
      withoutServer.call(context, SERVER_SOURCE, '/app/A.vue'),
    ).resolves.toBeUndefined()
  })

  it('leaves the sub-requests of a single-file component and the originals alone', async () => {
    const { resolveId } = await startedPlugin()

    await expect(
      resolveId.call(context, `${AVATAR}?vue&type=style&index=0`, '/app/A.vue'),
    ).resolves.toBeUndefined()
    await expect(
      resolveId.call(context, AVATAR, wrapperId(AVATAR)),
    ).resolves.toBeUndefined()
    await expect(
      resolveId.call(context, '/app/components/Other.vue', '/app/A.vue'),
    ).resolves.toBeUndefined()
  })

  it('wraps the component export and re-exports the rest', async () => {
    const { load } = await startedPlugin()

    expect(load.call({}, wrapperId(AVATAR))).toMatchInlineSnapshot(`
      "import { mockableComponent } from "${resolve(runtimeDir, 'mockable-component')}";
      import * as original from "/app/components/MyAvatar.vue";
      export * from "/app/components/MyAvatar.vue";
      export default mockableComponent("MyAvatar", original["default"])
      "
    `)
  })

  it('wraps the island factory by component name', async () => {
    const { load } = await startedPlugin()

    expect(load.call({}, wrapperId(`${SERVER_SOURCE}.js`)))
      .toMatchInlineSnapshot(`
      "import { mockableComponent } from "${resolve(runtimeDir, 'mockable-component')}";
      import * as original from "/app/node_modules/nuxt/dist/components/runtime/server-component.js";
      export * from "/app/node_modules/nuxt/dist/components/runtime/server-component.js";
      export const createServerComponent = (name) => mockableComponent(name, original.createServerComponent(name))
      "
    `)
  })
})
