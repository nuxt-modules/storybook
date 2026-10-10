import { expect, test } from '@playwright/test'

/**
 * Embedded mode asset routing (see the embedded webServer entries in
 * playwright.config.ts). The module shares Nuxt's Vite plugin instances with
 * Storybook's Vite server; `nuxt:dev-server` used to re-register Nuxt's dev
 * middleware against Storybook's server, whose `/_nuxt` proxy then pointed
 * back at Nuxt — every `/_nuxt/**` request looped (403/ENOBUFS) and the app
 * never hydrated. Both loopback families are covered because the proxied hop
 * must also carry a bracketed IPv6 `Host` to pass Vite's host check.
 */

const SERVERS = [
  {
    name: 'playground on [::1]',
    nuxt: 'http://[::1]:3100',
    storybook: 'http://127.0.0.1:6016',
  },
  {
    name: 'starter on 127.0.0.1',
    nuxt: 'http://127.0.0.1:3101',
    storybook: 'http://127.0.0.1:6017',
  },
]

for (const server of SERVERS) {
  test.describe(server.name, () => {
    test('nuxt serves its own vite client', async ({ request }) => {
      const response = await request.get(`${server.nuxt}/_nuxt/@vite/client`)

      expect(response.status()).toBe(200)
      expect(await response.text()).toContain('createHotContext')
    })

    test('the app loads its entry chunk and hydrates', async ({ page }) => {
      const failed: string[] = []
      const entries: string[] = []
      page.on('response', (response) => {
        const url = response.url()
        if (!url.includes('/_nuxt/')) return
        if (response.status() >= 400) failed.push(`${url} ${response.status()}`)
        if (/entry/.test(url) && response.status() === 200) entries.push(url)
      })

      const response = await page.goto(`${server.nuxt}/`)
      expect(response?.status()).toBe(200)

      await expect
        .poll(() =>
          page.evaluate(
            () => '__vue_app__' in (document.getElementById('__nuxt') ?? {}),
          ),
        )
        .toBe(true)
      expect(failed).toStrictEqual([])
      expect(entries.length).toBeGreaterThan(0)
    })

    test('storybook proxies nuxt assets through to nuxt', async ({
      request,
    }) => {
      const response = await request.get(
        `${server.storybook}/_nuxt/@vite/client`,
      )

      expect(response.status()).toBe(200)
      // Served by Nuxt's Vite (base /_nuxt/), not Storybook's own (base /)
      expect(await response.text()).toContain('"/_nuxt/"')
    })
  })
}
