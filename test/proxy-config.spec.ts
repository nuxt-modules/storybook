import { describe, expect, it } from 'vitest'

import type { Nuxt } from '@nuxt/schema'
import { getNuxtProxyConfig } from '../packages/storybook-addon/src/preset'

/**
 * Unit tests for the Storybook→Nuxt dev proxy configuration.
 *
 * The proxy target must be the dev server's actual address
 * (nuxt.options.devServer.url): the previous hardcoded localhost:3000
 * broke whenever Nuxt listened elsewhere (#993). The target is an object
 * (protocol/host/port) because http-proxy cannot parse bracketed IPv6
 * hosts like http://[::1]:3000 in string targets.
 */

function mockNuxt(devServer?: { url?: string; port?: number }): Nuxt {
  return {
    options: {
      devServer: devServer ?? {},
      runtimeConfig: { app: {} },
    },
  } as unknown as Nuxt
}

describe('nuxt dev proxy config', () => {
  it('targets the dev server url', () => {
    const { target, proxy } = getNuxtProxyConfig(
      mockNuxt({ url: 'http://127.0.0.1:54321/' }),
    )
    expect(target).toStrictEqual({
      host: '127.0.0.1',
      port: 54_321,
      protocol: 'http:',
    })
    expect(Object.values(proxy)[0]?.target).toStrictEqual(target)
  })

  it('unwraps bracketed IPv6 hosts for the connection only', () => {
    const { target, proxy } = getNuxtProxyConfig(
      mockNuxt({ url: 'http://[::1]:3000/' }),
    )
    expect(target).toStrictEqual({ host: '::1', port: 3000, protocol: 'http:' })

    // `changeOrigin` would copy the raw "::1" into the Host header, which
    // Vite's host check on the Nuxt side rejects. The bracketed authority
    // is sent explicitly instead.
    const rule = Object.values(proxy)[0]
    expect(rule?.changeOrigin).toBe(false)
    expect(rule?.headers).toStrictEqual({ host: '[::1]:3000' })
  })

  it('sends the dev server authority as Host', () => {
    const { proxy } = getNuxtProxyConfig(
      mockNuxt({ url: 'http://127.0.0.1:54321/' }),
    )
    expect(Object.values(proxy)[0]?.headers).toStrictEqual({
      host: '127.0.0.1:54321',
    })
  })

  it('falls back to the dev server port when no url is available', () => {
    const { host, target } = getNuxtProxyConfig(mockNuxt({ port: 4000 }))
    expect(target).toStrictEqual({
      host: 'localhost',
      port: 4000,
      protocol: 'http:',
    })
    expect(host).toBe('localhost:4000')
  })

  it('falls back to localhost:3000 when devServer has neither url nor port', () => {
    const { host, target } = getNuxtProxyConfig(mockNuxt())
    expect(target).toStrictEqual({
      host: 'localhost',
      port: 3000,
      protocol: 'http:',
    })
    expect(host).toBe('localhost:3000')
  })

  it('proxies /_nuxt assets but not the app manifest', () => {
    const { route } = getNuxtProxyConfig(mockNuxt())
    const matcher = new RegExp(route)

    expect('/_nuxt/some/asset.js').toMatch(matcher)
    expect('/_nuxt/@vite/client').toMatch(matcher)
    expect('/_ipx/w_100/img.png').toMatch(matcher)
    // App manifest files are specific to the Storybook build and must not
    // Be answered by the Nuxt app
    expect('/_nuxt/builds/meta/storybook.json').not.toMatch(matcher)
  })
})
