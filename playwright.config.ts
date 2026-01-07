import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// Debug mode: set DEBUG=1 to enable verbose logging and headed mode
const isDebug = !!process.env.DEBUG

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.browser.ts',
  /* Run tests in files in parallel (disabled in debug mode) */
  fullyParallel: !isDebug,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Longer timeout for debugging */
  timeout: isDebug ? 120000 : 30000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isDebug ? 'list' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://127.0.0.1:6006',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: isDebug ? 'on' : 'on-first-retry',

    /* Video recording in debug mode */
    video: isDebug ? 'on' : 'off',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: !isDebug,
        launchOptions: isDebug
          ? {
              slowMo: 100,
              args: ['--auto-open-devtools-for-tabs'],
            }
          : undefined,
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Debug-specific project with maximum visibility */
    {
      name: 'chromium-debug',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        launchOptions: {
          slowMo: 200,
          args: ['--auto-open-devtools-for-tabs'],
        },
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm playground:storybook:dev',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: !process.env.CI,
    /* Capture server output for debugging */
    stdout: isDebug ? 'pipe' : 'ignore',
    stderr: 'pipe',
    /* Longer timeout for Storybook startup */
    timeout: 120000,
  },
})
