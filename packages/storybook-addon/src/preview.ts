// Must be first
import './runtime/app/fetch'
// ---
import './runtime/endpoints/fetch'
import { setup } from '@storybook/vue3-vite'
import { h, resolveComponent } from 'vue'
import type { Decorator, StoryContext } from '@storybook/vue3'
import { beginStoryEndpoints } from './runtime/endpoints/registry'
import { beginStoryMocks } from './runtime/mocks/registry'
import { guardNavigateTo, navigation } from './runtime/app/navigation'
import { createStoryNuxtApp } from './runtime/app/nuxt-app'
import { NuxtStorybookRoot } from './runtime/app/nuxt-root'
import { beginStorySpies } from './runtime/mocks/story-spies'
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
    storyContext.parameters.fileName,
    storyContext.id,
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

export const loaders = [
  async (context: StoryContext) => {
    beginStoryEndpoints(context)
    await beginStoryMocks(
      context.canvasElement,
      context.parameters.fileName,
      nuxtParameters(context).navigation ? {} : { navigateTo: guardNavigateTo },
    )
  },
]

export const beforeEach = (context: StoryContext) => {
  navigation.mockClear()
  return beginStorySpies(context.canvasElement)
}

function nuxtParameters(context: StoryContext): NuxtParameters {
  return (context.parameters.nuxt ?? {}) as NuxtParameters
}
