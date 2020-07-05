declare module '@nuxt/types/config/index' {
  interface NuxtOptions {
    telemetry: boolean | Partial<{
      debug: boolean
      endpoint: string
      seed: string
      consent: 1
      enabled: boolean
    }>
  }
}
