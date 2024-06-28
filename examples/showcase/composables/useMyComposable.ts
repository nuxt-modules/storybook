export function useMyComposable() {
  // Because your composable is called in the right place in the lifecycle,
  // useRuntimeConfig will also work
  const config = useRuntimeConfig()
  // console.log('useMyComposable config', config)
  return { config }
}
