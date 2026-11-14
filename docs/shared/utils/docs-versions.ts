import { joinURL, withoutLeadingSlash, withoutTrailingSlash } from 'ufo'

export type DocsCollection = 'docsV10' | 'docsV11'

export interface DocsVersion {
  collection: DocsCollection
  /** Base of the GitHub links that edit a page of this version. */
  edit: string
  label: string
  /** Path the pages of this version are served under. */
  prefix: string
  value: string
}

/** The stable version is served at the root, the next one under its own prefix. */
export const DOCS_VERSIONS: DocsVersion[] = [
  {
    collection: 'docsV10',
    edit: 'https://github.com/nuxt-modules/storybook/edit/10.x/docs/content',
    label: 'v10',
    prefix: '/',
    value: 'v10',
  },
  {
    collection: 'docsV11',
    edit: 'https://github.com/nuxt-modules/storybook/edit/main/docs/content',
    label: 'v11 (next)',
    prefix: '/11.x',
    value: 'v11',
  },
]

export const STABLE_DOCS_VERSION = DOCS_VERSIONS[0]!

export function docsVersionOf(path: string): DocsVersion {
  return (
    DOCS_VERSIONS.find(
      ({ prefix }) =>
        prefix !== '/' && (path === prefix || path.startsWith(`${prefix}/`)),
    ) ?? STABLE_DOCS_VERSION
  )
}

/** GitHub link that edits a page, from its stem in the version's collection. */
export function docsEditUrl(
  version: DocsVersion,
  stem: string,
  extension: string,
): string {
  // Prefixed collections keep the prefix in the stem: `11.x/1.getting-started/1.setup`
  const prefix = `${withoutLeadingSlash(version.prefix)}/`
  const file =
    prefix !== '/' && stem.startsWith(prefix) ? stem.slice(prefix.length) : stem
  return `${joinURL(version.edit, file)}.${extension}`
}

/** The same page in another version, or its first page from the landing. */
export function docsVersionPath(path: string, target: DocsVersion): string {
  const current = docsVersionOf(path)
  const page =
    withoutTrailingSlash(
      current.prefix === '/' ? path : path.slice(current.prefix.length),
    ) || '/'
  return joinURL(target.prefix, page === '/' ? '/getting-started/setup' : page)
}
