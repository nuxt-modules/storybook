// Mimics what Nuxt >= 4.5 injects via the `$fetch` auto-import
import '#build/fetch.mjs'

export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: 'https://api.example.com',
  })

  return {
    provide: {
      api,
    },
  }
})
