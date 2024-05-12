import { useNuxtApp } from 'nuxt/app'
import { useRouter as useVueRouter } from 'vue-router'

export function useRouter() {
  const router = useNuxtApp()?.$router ?? useVueRouter()
  return router
}
