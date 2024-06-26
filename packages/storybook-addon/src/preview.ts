/**
 * This is loaded by the Storybook canvas preview iframe and applies to all stories.
 * https://github.com/storybookjs/storybook/blob/main/docs/contribute/framework.md#4-author-the-framework-itself
 * https://github.com/storybookjs/storybook/blob/main/docs/configure/index.md#configure-story-rendering
 *
 * We use it to load the Nuxt app in the preview iframe.
 */

import { setup } from '@storybook/vue3'
import type { NuxtApp } from 'nuxt/app'
import { createNuxtApp } from 'nuxt/app'

const nuxtApps = new Map<string, NuxtApp>()

setup((vueApp, storyContext) => {
  // We key the Nuxt apps to the id of the story
  // This is not totally correct, since the storybook vue renderer actually uses the canvas element
  // Also this doesn't allow to "forceRemount"
  // TODO: Improve this (needs PR to storybook to pass the necessary infos to this function)
  const key = storyContext?.id
  if (!key) {
    throw new Error('StoryContext is not provided')
  }

  const existingNuxtApp = nuxtApps.get(storyContext?.id)
  if (!existingNuxtApp) {
    const nuxt = createNuxtApp({
      vueApp,
      globalName: `nuxt-${storyContext?.id}`,
    })
    nuxtApps.set(key, nuxt)
  }
})
