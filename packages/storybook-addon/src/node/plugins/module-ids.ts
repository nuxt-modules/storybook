import { basename, dirname, extname, normalize } from 'pathe'

/** `<prefix>/app/a.ts?v=abc&wraps=x` → `/app/a.ts?v=abc` */
export function originalId(
  wrapperId: string,
  prefix: string,
  query: string,
): string {
  const [file = '', search] = wrapperId.slice(prefix.length).split('?')
  const params = new URLSearchParams(search)
  params.delete(query)
  return params.size > 0 ? `${file}?${params.toString()}` : file
}

export function withQuery(id: string, query: string): string {
  return `${id}${id.includes('?') ? '&' : '?'}${query}`
}

export function cleanId(id: string): string {
  return normalize(id.split('?')[0] ?? id)
}

// The names a source may be imported under, to skip resolving unrelated ones:
// `#app/composables/router` and `.../router.js` share `router`, and
// `~/composables/useFoo` reaches `useFoo/index.ts` through `useFoo`
export function stemsOf(path: string): string[] {
  const file = cleanId(path)
  const name = basename(file, extname(file))
  return name === 'index' ? [name, basename(dirname(file))] : [name]
}
