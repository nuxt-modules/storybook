import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ViteConfig } from '@nuxt/schema'
import { logger } from '../packages/nuxt-module/src/logger'

/** Shared with @storybook-vue/nuxt's loadNuxtViteConfig (#993). */
const VITE_CONFIG_PROMISE = Symbol.for(
  '@storybook-vue/nuxt:vite-config-promise',
)

/** Long enough for a blocked `listen` hook to lose the race below. */
const BLOCKED_HOOK_GRACE_MS = 50

const setupStorybook = vi.fn<() => Promise<void>>()

vi.mock('../packages/nuxt-module/src/storybook', () => ({
  setupStorybook: () => setupStorybook(),
}))

type StubNuxt = ReturnType<typeof createStubNuxt>

function createStubNuxt() {
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
    options: { logLevel: 'info', rootDir: process.cwd(), storybook: {} },
    registeredHooks: () => [...handlers.keys()].sort(),
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

function readViteConfigPromise(nuxt: StubNuxt) {
  return (nuxt as unknown as Record<symbol, Promise<ViteConfig> | undefined>)[
    VITE_CONFIG_PROMISE
  ]
}

describe('storybook module setup', () => {
  beforeEach(() => {
    setupStorybook.mockReset()
  })

  it('returns from the listen hook without waiting for storybook to start', async () => {
    // Storybook's preview build waits for the Vite config, which Nuxt only
    // resolves once boot proceeds past this hook — awaiting here deadlocks
    // both servers and hangs every request (#993).
    setupStorybook.mockReturnValue(new Promise(() => {}))
    const nuxt = createStubNuxt()
    await runModuleSetup(nuxt)

    const winner = await Promise.race([
      nuxt.callHook('listen').then(() => 'listen returned'),
      new Promise((resolve) =>
        setTimeout(() => resolve('listen blocked'), BLOCKED_HOOK_GRACE_MS),
      ),
    ])

    expect(winner).toMatchInlineSnapshot(`"listen returned"`)
    expect(setupStorybook).toHaveBeenCalledOnce()
  })

  it('resolves the shared promise with the client vite config', async () => {
    setupStorybook.mockResolvedValue()
    const nuxt = createStubNuxt()
    await runModuleSetup(nuxt)

    await nuxt.callHook(
      'vite:configResolved',
      { mode: 'server' },
      { isClient: false },
    )
    await nuxt.callHook(
      'vite:configResolved',
      { mode: 'client' },
      { isClient: true },
    )

    await expect(readViteConfigPromise(nuxt)).resolves.toMatchInlineSnapshot(`
      {
        "mode": "client",
      }
    `)
  })

  it('captures the vite config before storybook can start', async () => {
    // Storybook starts after 'listen'; by then vite:configResolved may
    // already have fired, so the capture cannot be registered lazily (#993).
    setupStorybook.mockResolvedValue()
    const nuxt = createStubNuxt()
    await runModuleSetup(nuxt)

    expect(nuxt.registeredHooks()).toMatchInlineSnapshot(`
      [
        "listen",
        "vite:configResolved",
      ]
    `)
  })

  it('logs a failed storybook start instead of rejecting the hook', async () => {
    setupStorybook.mockRejectedValue(new Error('port in use'))
    const error = vi.spyOn(logger, 'error').mockImplementation(() => {})
    const nuxt = createStubNuxt()
    await runModuleSetup(nuxt)

    await expect(nuxt.callHook('listen')).resolves.toBeUndefined()
    await vi.waitFor(() => expect(error).toHaveBeenCalled())

    expect(error.mock.calls[0]?.[0]).toMatchInlineSnapshot(
      `"Failed to start Storybook"`,
    )
    error.mockRestore()
  })

  it('registers nothing when the module is disabled', async () => {
    setupStorybook.mockResolvedValue()
    const nuxt = createStubNuxt()
    await runModuleSetup(nuxt, { enabled: false })

    expect(nuxt.registeredHooks()).toMatchInlineSnapshot(`[]`)
    expect(readViteConfigPromise(nuxt)).toBeUndefined()
    expect(setupStorybook).not.toHaveBeenCalled()
  })
})
