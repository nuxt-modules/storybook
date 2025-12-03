import { describe, expect, it } from 'vitest'

/**
 * Unit tests for the @nuxtjs/storybook module setup behavior.
 *
 * These tests verify that the module properly defers Storybook startup
 * to Nuxt's 'listen' hook, preventing the timing issue where Storybook
 * would start before Nuxt's HTTP server was ready (causing proxy EAGAIN errors).
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
  it('module uses listen hook to defer storybook startup', async () => {
    // Read the actual module source to verify the pattern
    const fs = await import('node:fs/promises')
    const path = await import('node:path')

    const moduleSource = await fs.readFile(
      path.resolve(__dirname, '../packages/nuxt-module/src/module.ts'),
      'utf-8',
    )

    // The fix pattern: nuxt.hook('listen', ...) should be used instead of
    // calling setupStorybook directly in setup()
    expect(moduleSource).toContain("nuxt.hook('listen'")

    // setupStorybook should be called inside the listen hook callback
    expect(moduleSource).toMatch(/nuxt\.hook\s*\(\s*['"]listen['"]\s*,\s*\(\)\s*=>\s*(?:\{\s*)?setupStorybook/)

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

  it('module checks for __STORYBOOK__ env before registering hook', async () => {
    const fs = await import('node:fs/promises')
    const path = await import('node:path')

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
    const path = await import('node:path')

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
