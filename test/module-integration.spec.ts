import type { PluginOption } from 'vite'

vi.mock(import('@storybook/vite-plugin'), () => ({
  experimental_vitePlugin: vitePlugin,
}))

type StubNuxt = ReturnType<typeof createStubNuxt>

function createStubNuxt(dev = true) {
  const handlers = new Map<string, ((...args: never[]) => unknown)[]>()
  const hook = (name: string, fn: (...args: never[]) => unknown) => {
    handlers.set(name, [...(handlers.get(name) ?? []), fn])
  }
  const callHook = async (name: string, ...args: unknown[]) => {
    await Promise.all(
      (handlers.get(name) ?? []).map((fn) => fn(...(args as never[]))),
    )
  }
  return {
    _version: '4.0.0',
    callHook,
    hook,
    hooks: { addHooks: () => {}, callHook, hook },
    options: {
      buildDir: '/app/.nuxt',
      dev,
      logLevel: 'info',
      rootDir: '/app',
      storybook: {},
      typescript: {},
    },
    registeredHooks: () => [...handlers.keys()].toSorted(),
    plugins: [],
  }
}

async function runModuleSetup(
  nuxt: StubNuxt,
  options: Record<string, unknown> = {},
) {
  const module = (await import('../packages/nuxt-module/src/module')).default
  await (module as unknown as (o: object, n: StubNuxt) => Promise<void>)(
    options,
    nuxt,
  )
}

async function extendViteConfig(nuxt: StubNuxt, isClient: boolean) {
  const config: { plugins?: PluginOption[] } = {}
  await nuxt.callHook('vite:extendConfig', config, { isClient })
  return config.plugins
}

function pluginName(plugin: PluginOption) {
  return plugin && 'name' in plugin ? plugin.name : plugin
}

describe('storybook module setup', () => {
  it('adds the storybook vite plugin to the client vite config only', async () => {
    const nuxt = createStubNuxt()
    await runModuleSetup(nuxt)

    expect(await extendViteConfig(nuxt, false)).toBeUndefined()
    const plugins = await extendViteConfig(nuxt, true)
    expect(plugins?.map(pluginName)).toMatchInlineSnapshot(`
      [
        "storybook:vite-plugin",
      ]
    `)
  })

  it('points the devtools tab at the storybook route', async () => {
    const nuxt = createStubNuxt()
    await runModuleSetup(nuxt, { route: '/stories' })

    const tabs: { view: object }[] = []
    await nuxt.callHook('devtools:customTabs', tabs)

    expect(tabs.map((tab) => tab.view)).toMatchInlineSnapshot(`
      [
        {
          "src": "/stories/",
          "type": "iframe",
        },
      ]
    `)
  })

  it('registers no dev hooks outside of nuxt dev', async () => {
    const nuxt = createStubNuxt(false)
    await runModuleSetup(nuxt)

    expect(nuxt.registeredHooks()).toMatchInlineSnapshot(`[]`)
    expect(nuxt.options.typescript).toMatchInlineSnapshot(`
      {
        "tsConfig": {
          "include": [
            "../.storybook/**/*",
          ],
        },
      }
    `)
  })

  it('registers nothing when the module is disabled', async () => {
    const nuxt = createStubNuxt()
    await runModuleSetup(nuxt, { enabled: false })

    expect(nuxt.registeredHooks()).toMatchInlineSnapshot(`[]`)
  })
})
