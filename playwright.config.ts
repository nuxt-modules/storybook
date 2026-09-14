import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './test',
  testMatch: '**/*.browser.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: [
    {
      command: 'pnpm playground:storybook:dev',
      reuseExistingServer: !process.env.CI,
      url: 'http://127.0.0.1:6006',
    },
    // Embedded mode: `nuxt dev` starts Storybook itself, so readiness is
    // checked on the embedded Storybook port. Nuxt's port is passed as a flag
    // rather than PORT, which Storybook's dev server would also try to bind.
    {
      command: 'pnpm --filter=./playground exec nuxt dev --port 3100',
      env: {
        STORYBOOK_PORT: '6016',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: 'http://127.0.0.1:6016',
    },
  ],
})
