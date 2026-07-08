import { expect, test } from '@playwright/test'

/**
 * Embedded mode: the @nuxtjs/storybook module starts Storybook from inside
 * `nuxt dev` (see the second webServer entry in playwright.config.ts).
 *
 * Regression coverage for #993: starting Storybook used to deadlock Nuxt's
 * boot pipeline, leaving the Nuxt app hanging on every request while only
 * Storybook's manager UI came up.
 */

test('nuxt app responds while storybook runs embedded', async ({ page }) => {
  await page.goto('http://localhost:3100/')

  // The playground app renders <NuxtWelcome />
  await expect(page).toHaveTitle('Welcome to Nuxt!')
  await expect(page.getByRole('heading', { name: 'Get started' })).toBeVisible()
})

test('embedded storybook renders the story example', async ({ page }) => {
  await page.goto(
    'http://localhost:6016/iframe.html?viewMode=story&id=example-nuxtwelcome--nuxt-welcome-story',
  )
  await page.locator('#storybook-root').waitFor()
  await page.locator('.sb-preparing-story').waitFor({ state: 'hidden' })

  await expect(
    page.locator('#storybook-root').getByRole('heading', {
      exact: true,
      name: 'Welcome Nuxt to Storybook',
    }),
  ).toBeVisible()
})

// Note: the docs example is intentionally not tested in embedded mode yet.
// The embedded story index is missing all addon-docs entries (autodocs and
// MDX) — a separate bug from the #993 deadlock, tracked independently.
