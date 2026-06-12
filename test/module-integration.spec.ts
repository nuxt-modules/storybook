import { describe, expect, it } from 'vitest'

/**
 * Unit tests for the @nuxtjs/storybook module setup behavior.
 *
 * These tests verify that the module starts Storybook from Nuxt's 'listen'
 * hook WITHOUT awaiting it, and that the client Vite config is captured
 * during module setup. Awaiting Storybook inside the listen hook deadlocks
 * the dev server: Nuxt's boot pipeline waits for the hook handler while
 * Storybook's preview build waits for Nuxt's vite:configResolved event,
 * which only fires once boot proceeds (#993).
 *
 * We test the module.ts file directly by reading its source and verifying
 * the hook registration pattern. This is simpler than mocking the full
 * @nuxt/kit environment.
 *
 * Note: Full integration tests with actual Storybook server are not possible
 * in Vitest due to @nuxt/test-utils limitations with dev mode. For E2E testing
 * of Storybook startup, use Playwright tests instead.
 */
describe('storybook module setup', () => {
  it('module starts storybook from the listen hook without blocking it', async () => {
    // Read the actual module source to verify the pattern
    const fs = await import('node:fs/promises')
    const path = await import('pathe')

    const moduleSource = await fs.readFile(
      path.resolve(__dirname, '../packages/nuxt-module/src/module.ts'),
      'utf-8',
    )

    // Storybook startup is deferred to nuxt.hook('listen', ...) instead of
    // running directly in setup()
    expect(moduleSource).toContain("nuxt.hook('listen'")

    // setupStorybook is called inside the listen hook callback, but must NOT
    // be awaited: that blocks Nuxt's boot pipeline and deadlocks against
    // Storybook waiting for the Vite config (#993)
    expect(moduleSource).toMatch(
      /nuxt\.hook\s*\(\s*['"]listen['"]\s*,\s*\(\)\s*=>\s*\{\s*setupStorybook/,
    )
    expect(moduleSource).not.toMatch(/await\s+setupStorybook/)

    // The fire-and-forget call must still surface failures
    expect(moduleSource).toMatch(/setupStorybook\([^)]*\)\.catch/)

    // setupStorybook should NOT be called directly in the setup function
    // (outside of the listen hook)
    // Find the setup function and extract content before the listen hook
    const setupStart = moduleSource.indexOf('async setup(')
    expect(setupStart).toBeGreaterThan(-1)

    const listenHookPos = moduleSource.indexOf("nuxt.hook('listen'", setupStart)
    expect(listenHookPos).toBeGreaterThan(setupStart)

    // Get content between setup start and listen hook
    const beforeHook = moduleSource.slice(setupStart, listenHookPos)
    // setupStorybook should not be called before the hook
    expect(beforeHook).not.toContain('setupStorybook(')
  })

  it('module captures the vite config before the listen hook', async () => {
    const fs = await import('node:fs/promises')
    const path = await import('pathe')

    const moduleSource = await fs.readFile(
      path.resolve(__dirname, '../packages/nuxt-module/src/module.ts'),
      'utf-8',
    )

    // The vite:configResolved capture must be registered during module setup,
    // before the listen hook: Storybook starts after 'listen' fires, at which
    // point the event may already have passed (#993)
    const capturePos = moduleSource.indexOf("nuxt.hook('vite:configResolved'")
    const listenPos = moduleSource.indexOf("nuxt.hook('listen'")
    expect(capturePos).toBeGreaterThan(-1)
    expect(listenPos).toBeGreaterThan(capturePos)

    // The captured promise is shared with @storybook-vue/nuxt via a
    // well-known symbol on the Nuxt instance
    expect(moduleSource).toContain(
      "Symbol.for('@storybook-vue/nuxt:vite-config-promise')",
    )
  })

  it('module checks for __STORYBOOK__ env before registering hook', async () => {
    const fs = await import('node:fs/promises')
    const path = await import('pathe')

    const moduleSource = await fs.readFile(
      path.resolve(__dirname, '../packages/nuxt-module/src/module.ts'),
      'utf-8',
    )

    // Should check for __STORYBOOK__ to avoid recursion
    expect(moduleSource).toContain('__STORYBOOK__')
    // Should early return when inside Storybook
    expect(moduleSource).toMatch(/if\s*\(\s*import\.meta\.env\?\.__STORYBOOK__/)
  })

  it('module checks enabled option before registering hook', async () => {
    const fs = await import('node:fs/promises')
    const path = await import('pathe')

    const moduleSource = await fs.readFile(
      path.resolve(__dirname, '../packages/nuxt-module/src/module.ts'),
      'utf-8',
    )

    // Should check if module is enabled
    expect(moduleSource).toContain('options.enabled')
    // Should have enabled in defaults
    expect(moduleSource).toMatch(/enabled:\s*true/)
  })
})
