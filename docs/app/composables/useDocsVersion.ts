export function useDocsVersion() {
  const route = useRoute()
  return computed(() => docsVersionOf(route.path))
}
