import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
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
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './test',
  testMatch: '**/*.browser.ts',
  use: {
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'pnpm playground:storybook:dev',
      reuseExistingServer: !process.env.CI,
      url: 'http://127.0.0.1:6006',
    },
    // Embedded mode: `nuxt dev` starts Storybook itself, so readiness is
    // Checked on the embedded Storybook port. Nuxt's port is passed as a flag
    // Rather than PORT, which Storybook's dev server would also try to bind.
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
  workers: process.env.CI ? 1 : undefined,
})
