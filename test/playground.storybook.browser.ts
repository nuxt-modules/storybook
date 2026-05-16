import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const storybookBaseUrl = 'http://localhost:6006'

async function waitForStorybookIdle(page: Page) {
  await page.locator('.sb-preparing-story').waitFor({ state: 'hidden' })
  await page.locator('.sb-preparing-docs').waitFor({ state: 'hidden' })
}

test('no errors', async ({ page }) => {
  await page.goto(`${storybookBaseUrl}/iframe.html`)
  await page.locator('.sb-nopreview').waitFor() // That's the normal for the iframe with no story selected
  await waitForStorybookIdle(page)

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
    `${storybookBaseUrl}/iframe.html?viewMode=docs&id=example-nuxtwelcome--docs`,
  )
  await page.locator('#storybook-docs').waitFor()
  await waitForStorybookIdle(page)

  const text = await page
    .locator(
      'div#story--example-nuxtwelcome--nuxt-welcome-story--primary-inner > h1',
    )
    .textContent()
  expect(text).toContain('Welcome Nuxt to Storybook')
})

test('renders the story example', async ({ page }) => {
  await page.goto(
    `${storybookBaseUrl}/iframe.html?viewMode=story&id=example-nuxtwelcome--nuxt-welcome-story`,
  )
  await page.locator('#storybook-root').waitFor()
  await waitForStorybookIdle(page)

  const text = await page.locator('#storybook-root > h1').textContent()
  expect(text).toContain('Welcome Nuxt to Storybook')
})

test('logs navigation attempts in the actions panel', async ({ page }) => {
  await page.goto(
    `${storybookBaseUrl}/?path=/story/playground-navigation-navbar--default`,
  )
  await page.locator('iframe[title="storybook-preview-iframe"]').waitFor()
  await waitForStorybookIdle(page)

  await page.getByRole('tab', { name: /^Actions$/ }).click()

  const previewFrame = page.frameLocator('iframe[title="storybook-preview-iframe"]')
  await previewFrame.getByRole('link', { name: 'Docs' }).click()

  const actionsPanel = page.getByRole('tabpanel', { name: /Actions/ })
  const navigateRow = actionsPanel.getByRole('treeitem', {
    name: /navigate: \(1\)/,
  })

  await expect(navigateRow).toBeVisible()
  await navigateRow.click()
  await actionsPanel.getByRole('treeitem', { name: /0: Object/ }).click()

  await expect(actionsPanel).toContainText('to: "/docs"')
  await expect(actionsPanel).toContainText(
    'from: "/iframe.html?id=playground-navigation-navbar--default&viewMode=story"',
  )
})
