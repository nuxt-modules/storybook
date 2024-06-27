/**
 * This is loaded by the Storybook canvas preview iframe and applies to all stories.
 * https://github.com/storybookjs/storybook/blob/main/docs/contribute/framework.md#4-author-the-framework-itself
 * https://github.com/storybookjs/storybook/blob/main/docs/configure/index.md#configure-story-rendering
 *
 * We use it to load the Nuxt app in the preview iframe.
 * This should contain the same setup as the what Nuxt does in the background.
 * https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/entry.ts
 */

import { setup } from '@storybook/vue3'
import { applyPlugins, createNuxtApp } from 'nuxt/app'
import { getContext } from 'unctx'

import '#build/fetch.mjs'
import '#build/css'
// @ts-expect-error virtual file
import plugins from '#build/plugins'

setup(async (vueApp, storyContext) => {
  // We key the Nuxt apps to the id of the story
  // This is not totally correct, since the storybook vue renderer actually uses the canvas element
  // Also this doesn't allow to "forceRemount"
  // TODO: Improve this (needs PR to storybook to pass the necessary infos to this function)
  const key = storyContext?.id
  if (!key) {
    throw new Error('StoryContext is not provided')
  }
  const nuxtAppName = `nuxt-app-${key}`
  const nuxtCtx = getContext(nuxtAppName)
  if (nuxtCtx.tryUse()) {
    // Nothing to do, the Nuxt app is already created
    return
  }

  const nuxt = createNuxtApp({
    vueApp,
    globalName: nuxtAppName,
  })
  nuxtCtx.set(nuxt)

  await applyPlugins(nuxt, plugins)

  await nuxt.hooks.callHook('app:created', vueApp)
  await nuxt.hooks.callHook('app:beforeMount', vueApp)

  // TODO: The following are usually called after the app is mounted
  // but currently storybook doesn't provide a hook to do that
  // await nuxt.hooks.callHook('app:mounted', vueApp)
  // await nextTick()
})
