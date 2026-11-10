import { expect, test } from '@playwright/test'

/**
 * Embedded mode: `nuxt dev` serves Storybook under /_storybook/ on its own
 * port (see the second webServer entry in playwright.config.ts). The app must
 * stay responsive while Storybook runs inside it (#993).
 */

test('nuxt app responds while storybook runs embedded', async ({ page }) => {
  await page.goto('http://localhost:3100/')

  await expect(page).toHaveTitle('Welcome to Nuxt!')
  await expect(page.getByRole('heading', { name: 'Get started' })).toBeVisible()
})

test('embedded storybook renders the story example', async ({ page }) => {
  await page.goto(
    'http://localhost:3100/_storybook/iframe.html?viewMode=story&id=example-nuxtwelcome--nuxt-welcome-story',
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

test('embedded storybook renders the docs example', async ({ page }) => {
  await page.goto(
    'http://localhost:3100/_storybook/iframe.html?viewMode=docs&id=example-nuxtwelcome--docs',
  )
  await page.locator('#storybook-docs').waitFor()
  await page.locator('.sb-preparing-docs').waitFor({ state: 'hidden' })

  await expect(
    page.locator('#storybook-docs').getByRole('heading', {
      exact: true,
      name: 'Welcome Nuxt to Storybook',
    }),
  ).toBeVisible()
})

test('embedded storybook serves the manager on the nuxt port', async ({
  page,
}) => {
  await page.goto('http://localhost:3100/_storybook/')

  await expect(
    page.getByRole('button', { name: 'NuxtWelcome' }).first(),
  ).toBeVisible()
})
