import { test, expect } from '@playwright/test'

test('no errors', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html')
  await page.locator('.sb-nopreview').waitFor() // That's the normal for the iframe with no story selected
  await page.locator('.sb-preparing-story').waitFor({ state: 'hidden' })
  await page.locator('.sb-preparing-docs').waitFor({ state: 'hidden' })

  try {
    await page
      .locator('#error-message')
      .waitFor({ state: 'visible', timeout: 1000 })
  } catch {
    // Ignore, error message is not visible and that's what we want
  }

  await expect(page.locator('#error-message')).toBeEmpty({ timeout: 1 })
})

test('renders the docs example', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?viewMode=docs&id=example-nuxtwelcome--docs',
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

test('renders the story example', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?viewMode=story&id=example-nuxtwelcome--nuxt-welcome-story',
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
