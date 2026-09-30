import { setup } from '@storybook/vue3-vite'
import { h, resolveComponent } from 'vue'
import type { Decorator, StoryContext } from '@storybook/vue3'
import { navigation } from './runtime/navigation'
import { createStoryNuxtApp } from './runtime/nuxt-app'
import { NuxtStorybookRoot } from './runtime/nuxt-root'
import type { NuxtParameters } from './types'

setup(async (vueApp, storyContext) => {
  if (!storyContext?.canvasElement) {
    throw new Error(
      '[nuxt-storybook] Storybook did not provide a story context',
    )
  }

  await createStoryNuxtApp(
    vueApp,
    storyContext.canvasElement,
    nuxtParameters(storyContext),
  )
})

export const decorators: Decorator[] = [
  () => ({
    setup: () => () =>
      h(NuxtStorybookRoot, null, {
        default: () => h(resolveComponent('story')),
      }),
  }),
]

export const beforeEach = () => {
  navigation.mockClear()
}
function nuxtParameters(context: StoryContext): NuxtParameters {
  return (context.parameters.nuxt ?? {}) as NuxtParameters
}
