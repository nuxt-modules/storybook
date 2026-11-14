import { expect, test } from '@playwright/test'

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

test('throws on a docs page mixing story files, out of the Nuxt context', async ({
  page,
}) => {
  await page.goto(
    'http://localhost:6006/iframe.html?viewMode=docs&id=nuxt-docs-page-errors-mixed-story-files--docs',
  )
  await page.locator('#storybook-docs').waitFor()
  await page.locator('.sb-preparing-docs').waitFor({ state: 'hidden' })

  const docs = page.locator('#storybook-docs')
  await expect(page.getByTestId('formatted')).toHaveText([
    'Mocked 10 €',
    'Mocked total: 20 €',
  ])
  // NuxtMocksSharedOnDocsPageError
  await expect(docs).toContainText(
    '[nuxt-storybook] formatPrice() ran outside of the Nuxt context',
    { timeout: 10_000 },
  )
  // NuxtSpySharedOnDocsPageError
  await expect(docs).toContainText(
    '[nuxt-storybook] The story of formatTotal.mockReturnValue() is unknown',
    { timeout: 10_000 },
  )
})

for (const [id, text] of [
  ['nuxt-docs-page-errors-price--price', 'Mocked 10 €'],
  ['nuxt-docs-page-errors-price--formatted-in-helper', 'Mocked 10 €'],
  ['nuxt-docs-page-errors-total--total', 'Mocked total: 20 €'],
  ['nuxt-docs-page-errors-total--configured-in-helper', 'Configured total'],
]) {
  test(`resolves the mocks of the only story of the page: ${id}`, async ({
    page,
  }) => {
    await page.goto(`http://localhost:6006/iframe.html?viewMode=story&id=${id}`)
    await page.locator('#storybook-root').waitFor()
    await page.locator('.sb-preparing-story').waitFor({ state: 'hidden' })

    await expect(page.getByTestId('formatted')).toHaveText(text, {
      timeout: 10_000,
    })
  })
}

test('renders a CSF Factories story inside the Nuxt app', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?viewMode=story&id=nuxt-runtimeconfig--overridden-by-story',
  )
  await page.locator('#storybook-root').waitFor()
  await page.locator('.sb-preparing-story').waitFor({ state: 'hidden' })

  await expect(page.getByTestId('api-base')).toHaveText(
    'https://staging.example.com',
  )
  await expect(page.locator('#error-message')).toBeEmpty()
})

for (const [id, text] of [
  ['nuxt-profile-mocked--mocked', '🧪 Ada Lovelace'],
  ['nuxt-routing-mocked--mocked-route', 'route: /mocked?from=story'],
  ['nuxt-greeting-mocked--mocked-in-hook', 'Hallo Nuxt'],
  ['nuxt-profile-mocked--mocked-in-hook', '🪝 Ada Lovelace'],
  ['nuxt-users--registered-in-hook', 'Grace'],
]) {
  test(`renders the mocks like @nuxt/test-utils: ${id}`, async ({ page }) => {
    await page.goto(`http://localhost:6006/iframe.html?viewMode=story&id=${id}`)
    await page.locator('#storybook-root').waitFor()
    await page.locator('.sb-preparing-story').waitFor({ state: 'hidden' })

    await expect(page.locator('#storybook-root')).toContainText(text, {
      timeout: 10_000,
    })
    await expect(page.locator('#error-message')).toBeEmpty()
  })
}

for (const id of [
  'nuxt-navigateto--blocked-external',
  'nuxt-navigateto--blocked-open',
]) {
  test(`keeps navigateTo in the story: ${id}`, async ({ page }) => {
    const url = `http://localhost:6006/iframe.html?viewMode=story&id=${id}`
    await page.goto(url)
    await page.locator('#storybook-root').waitFor()
    await page.locator('.sb-preparing-story').waitFor({ state: 'hidden' })
    const popups: unknown[] = []
    page.on('popup', (popup) => popups.push(popup))

    await page.getByRole('button').click()

    await expect(page.getByText(/^route: /)).toBeVisible()
    expect(page.url()).toBe(url)
    expect(popups).toStrictEqual([])
  })
}
