// Add globals for Nuxt's `__NUXT__` object - this may be unnecessary with Nuxt 4

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __NUXT__?: Record<string, any> | Record<string, Record<string, any>>
  }
}

export {}
