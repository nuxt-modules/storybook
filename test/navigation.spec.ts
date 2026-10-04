// @vitest-environment happy-dom


import type { RouteLocationNormalized } from 'vue-router'
import {
  blockRouterNavigation,
  guardExternalLinks,
  isExternalUrl,
  navigation,
} from '../packages/storybook-addon/src/runtime/navigation'

function renderCanvas(html: string): HTMLElement {
  const canvasElement = document.createElement('div')
  canvasElement.innerHTML = html
  document.body.append(canvasElement)
  return canvasElement
}

function clickLink(canvasElement: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  canvasElement.querySelector('a')!.dispatchEvent(event)
  return event
}

beforeEach(() => {
  document.body.innerHTML = ''
  navigation.mockClear()
})

describe(isExternalUrl, () => {
  it('reports a foreign origin', () => {
    expect(isExternalUrl('https://nuxt.com/docs')).toBe(true)
  })

  it('reports a protocol-relative host', () => {
    expect(isExternalUrl('//nuxt.com/docs')).toBe(true)
  })

  it('ignores the preview origin', () => {
    expect(isExternalUrl(`${location.origin}/about`)).toBe(false)
  })

  it('ignores relative links', () => {
    expect(isExternalUrl('/about')).toBe(false)
    expect(isExternalUrl('about')).toBe(false)
  })

  it('ignores protocols the browser owns', () => {
    expect(isExternalUrl('mailto:hi@nuxt.com')).toBe(false)
    expect(isExternalUrl('tel:+33123456789')).toBe(false)
  })
})

describe(blockRouterNavigation, () => {
  it('aborts the navigation and reports its target', () => {
    const to = { fullPath: '/about?tab=1' } as RouteLocationNormalized

    expect(blockRouterNavigation(to)).toBe(false)
    expect(navigation).toHaveBeenCalledWith('/about?tab=1')
  })
})

describe(guardExternalLinks, () => {
  it('blocks an external link and reports its absolute URL', () => {
    const canvasElement = renderCanvas(
      '<a href="//nuxt.com/docs"><span>docs</span></a>',
    )
    guardExternalLinks(canvasElement)

    expect(clickLink(canvasElement).defaultPrevented).toBe(true)
    expect(navigation).toHaveBeenCalledWith(
      `${location.protocol}//nuxt.com/docs`,
    )
  })

  it('leaves a same-origin link to the router', () => {
    const canvasElement = renderCanvas('<a href="/about">about</a>')
    guardExternalLinks(canvasElement)

    expect(clickLink(canvasElement).defaultPrevented).toBe(false)
    expect(navigation).not.toHaveBeenCalled()
  })

  it('stops guarding once removed', () => {
    const canvasElement = renderCanvas('<a href="https://nuxt.com/">nuxt</a>')
    guardExternalLinks(canvasElement)()

    expect(clickLink(canvasElement).defaultPrevented).toBe(false)
    expect(navigation).not.toHaveBeenCalled()
  })
})
