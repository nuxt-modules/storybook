import { expect, test } from '@playwright/test'

/**
 * Embedded mode: the module starts Storybook from inside `nuxt dev` (see the
 * second webServer entry in playwright.config.ts). Both servers must stay
 * responsive — starting Storybook used to deadlock Nuxt's boot pipeline (#993).
 */

test('nuxt app responds while storybook runs embedded', async ({ page }) => {
  await page.goto('http://localhost:3100/')

  await expect(page).toHaveTitle('Welcome to Nuxt!')
  await expect(page.getByRole('heading', { name: 'Get started' })).toBeVisible()
})

test("storybook does not reconfigure the app's own vite plugins (#1072)", async ({
  request,
}) => {
  // See playground/modules/stateful-vite-plugin-probe.ts: by the time this
  // test runs, embedded Storybook (playwright's other webServer entry) has
  // already finished booting against the same running Nuxt dev server.
  const response = await request.get(
    'http://localhost:3100/_probe/bound-servers',
  )

  expect(await response.json()).toEqual({ boundServerCount: 1 })
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

// The docs example is not covered here: the embedded story index is missing
// its addon-docs entries (autodocs and MDX), a separate bug from #993.
