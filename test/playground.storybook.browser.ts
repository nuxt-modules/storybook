import {
  test,
  expect,
  waitForNetworkIdleWithLogging,
} from './helpers/debug-browser'

test('no errors', async ({ page, debugContext, nuxtMonitor }) => {
  await page.goto('/iframe.html')

  // Wait for Storybook to initialize
  await page.locator('.sb-nopreview').waitFor()
  await page.locator('.sb-preparing-story').waitFor({ state: 'hidden' })
  await page.locator('.sb-preparing-docs').waitFor({ state: 'hidden' })

  // Wait for network to settle (catches late proxy requests)
  await waitForNetworkIdleWithLogging(page, { idleTime: 1000 })

  // Log application state for debugging
  await nuxtMonitor.logFullState()

  // Check for error message element
  try {
    await page
      .locator('#error-message')
      .waitFor({ state: 'visible', timeout: 1000 })
  } catch {
    // Ignore, error message is not visible and that's what we want
  }

  // Assert no errors
  await expect(page.locator('#error-message')).toBeEmpty({ timeout: 1 })

  // Additional assertion: no proxy errors detected
  expect(debugContext.proxyErrors, 'Expected no proxy errors').toHaveLength(0)
})

test('renders the docs example', async ({
  page,
  debugContext,
  nuxtMonitor,
}) => {
  await page.goto('/iframe.html?viewMode=docs&id=example-nuxtwelcome--docs')

  await page.locator('#storybook-docs').waitFor()
  await page.locator('.sb-preparing-docs').waitFor({ state: 'hidden' })

  // Wait for network to settle
  await waitForNetworkIdleWithLogging(page, { idleTime: 1000 })

  // Log state before assertion
  await nuxtMonitor.logFullState()

  const text = await page
    .locator(
      'div#story--example-nuxtwelcome--nuxt-welcome-story--primary-inner > h1',
    )
    .textContent()
  expect(text).toContain('Welcome Nuxt to Storybook')

  // Verify no proxy errors
  expect(
    debugContext.proxyErrors,
    'Expected no proxy errors in docs view',
  ).toHaveLength(0)
})

test('renders the story example', async ({
  page,
  debugContext,
  nuxtMonitor,
}) => {
  await page.goto(
    '/iframe.html?viewMode=story&id=example-nuxtwelcome--nuxt-welcome-story',
  )

  await page.locator('#storybook-root').waitFor()
  await page.locator('.sb-preparing-story').waitFor({ state: 'hidden' })

  // Wait for network to settle
  await waitForNetworkIdleWithLogging(page, { idleTime: 1000 })

  // Log state before assertion
  await nuxtMonitor.logFullState()

  const text = await page.locator('#storybook-root > h1').textContent()
  expect(text).toContain('Welcome Nuxt to Storybook')

  // Verify no proxy errors
  expect(
    debugContext.proxyErrors,
    'Expected no proxy errors in story view',
  ).toHaveLength(0)
})

/**
 * Dedicated proxy error detection test
 * This test specifically monitors for proxy-related issues
 */
test('no proxy errors during navigation', async ({
  page,
  debugContext,
  nuxtMonitor,
}) => {
  // Navigate to main Storybook UI
  await page.goto('/')

  // Wait for initial load
  await page.waitForLoadState('networkidle')

  // Navigate to a story
  await page.goto(
    '/iframe.html?viewMode=story&id=example-nuxtwelcome--nuxt-welcome-story',
  )
  await page.locator('#storybook-root').waitFor()

  // Navigate to docs
  await page.goto('/iframe.html?viewMode=docs&id=example-nuxtwelcome--docs')
  await page.locator('#storybook-docs').waitFor()

  // Final network settle
  await waitForNetworkIdleWithLogging(page, { idleTime: 2000 })

  // Log comprehensive state
  await nuxtMonitor.logFullState()

  // Check for any proxy-related errors
  const proxyErrors = debugContext.proxyErrors
  const networkFailures = debugContext.networkRequests.filter((r) => r.failure)
  const httpErrors = debugContext.networkRequests.filter(
    (r) => r.response && r.response.status() >= 400,
  )

  console.log('\n--- Proxy Error Analysis ---')
  console.log(`Proxy errors: ${proxyErrors.length}`)
  console.log(`Network failures: ${networkFailures.length}`)
  console.log(`HTTP 4xx/5xx: ${httpErrors.length}`)

  if (proxyErrors.length > 0) {
    console.log('\nProxy error URLs:')
    proxyErrors.forEach((e) => {
      console.log(`  - ${e.request.method()} ${e.request.url()}`)
      if (e.failure) console.log(`    Error: ${e.failure}`)
      if (e.response) console.log(`    Status: ${e.response.status()}`)
    })
  }

  // Assert no proxy errors
  expect(
    proxyErrors,
    'Expected no proxy errors during navigation',
  ).toHaveLength(0)
})
