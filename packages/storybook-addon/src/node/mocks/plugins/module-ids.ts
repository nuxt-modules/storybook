import { basename, dirname, extname, normalize } from 'pathe'

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
