import { isNuxtError, useNuxtApp, useRoute } from 'nuxt/app'
import {
  Suspense,
  defineComponent,
  h,
  inject,
  onErrorCaptured,
  onMounted,
  onUnmounted,
  provide,
} from 'vue'
import type { NuxtApp } from 'nuxt/app'
import { PageRouteSymbol } from '#app/components/injections'
import { guardExternalLinks } from './navigation'
import { STORY_APP, disposeStoryNuxtApp } from './nuxt-app'


export const NuxtStorybookRoot = defineComponent({
  name: 'NuxtStorybookRoot',
  setup(_props, { slots }) {
    const nuxtApp = useNuxtApp()
    const story = inject(STORY_APP, undefined)

    provide(PageRouteSymbol, useRoute())
    callVueSetupHooks(nuxtApp)

    onErrorCaptured((error, target, info) => {
      void Promise.resolve(
        nuxtApp.hooks.callHook('vue:error', error, target, info),
      ).catch((hookError: unknown) =>
        console.error('[nuxt] Error in `vue:error` hook', hookError),
      )
      if (isNuxtError(error) && (error.fatal || error.unhandled)) {
        return false
      }
    })

    let removeLinkGuard: (() => void) | undefined
    onMounted(() => {
      if (story && !story.parameters.navigation) {
        removeLinkGuard = guardExternalLinks(story.canvasElement)
      }
      void nuxtApp.hooks.callHook('app:mounted', nuxtApp.vueApp)
    })

    onUnmounted(() => {
      removeLinkGuard?.()
      disposeStoryNuxtApp(nuxtApp)
    })

    const onResolve = () => {
      void nuxtApp.hooks.callHook('app:suspense:resolve')
    }

    return () => h(Suspense, { onResolve }, slots.default?.())
  },
})

function callVueSetupHooks(nuxtApp: NuxtApp) {
  const results = nuxtApp.hooks.callHookWith(
    (hooks) => hooks.map((hook) => hook()),
    'vue:setup',
    [],
  ) as unknown[]
  const deferred = results.some(
    (result) => result && typeof result === 'object' && 'then' in result,
  )
  if (deferred) {
    console.error('[nuxt] Error in `vue:setup`. Callbacks must be synchronous.')
  }
}
