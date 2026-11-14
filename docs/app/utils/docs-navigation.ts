import type { ContentNavigationItem } from '@nuxt/content'

/** Navigation of a version, without the folder of its path prefix (`/11.x`). */
export function docsVersionNavigation(
  items: ContentNavigationItem[],
  version: DocsVersion,
): ContentNavigationItem[] {
  return items.find(({ path }) => path === version.prefix)?.children ?? items
}
