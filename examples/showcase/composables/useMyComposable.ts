export function useMyComposable() {
  // Because your composable is called in the right place in the lifecycle,
  // UseRuntimeConfig will also work
  const config = useRuntimeConfig()
  // Console.log('useMyComposable config', config)
  return { config }
}
