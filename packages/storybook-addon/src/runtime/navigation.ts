import { fn } from 'storybook/test'
import type { Mock } from 'storybook/test'
import type { RouteLocationNormalized } from 'vue-router'

const PREVIEW_PROTOCOLS = new Set(['http:', 'https:'])

export function blockRouterNavigation(to: RouteLocationNormalized): false {
  navigation(to.fullPath)
  return false
}

export function guardExternalLinks(canvasElement: HTMLElement): () => void {
  canvasElement.addEventListener('click', blockExternalLink, true)
  return () =>
    canvasElement.removeEventListener('click', blockExternalLink, true)
}

export const navigation: Mock = fn().mockName('nuxt::navigation')

export function isExternalUrl(url: string): boolean {
  let resolved: URL
  try {
    resolved = new URL(url, location.href)
  } catch {
    return false
  }
  return (
    PREVIEW_PROTOCOLS.has(resolved.protocol) &&
    resolved.origin !== location.origin
  )
}

function blockExternalLink(event: Event) {
  const href = (event.target as Element | null)
    ?.closest?.('a[href]')
    ?.getAttribute('href')
  if (!href || !isExternalUrl(href)) {
    return
  }
  event.preventDefault()
  navigation(new URL(href, location.href).href)
}
