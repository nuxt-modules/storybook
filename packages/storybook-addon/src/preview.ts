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
import type { ObjectPlugin, Plugin } from 'nuxt/app'
import { applyPlugins, createNuxtApp } from 'nuxt/app'
import { getContext } from 'unctx'
import { $fetch } from 'ofetch'
// @ts-expect-error virtual file
import { runtimeConfig } from 'virtual:nuxt-runtime-config'

// This is used to overwrite the fetch function, not sure if it's necessary for Storybook
// It doesn't work with the current setup
// import '#build/fetch.mjs'
import '#build/css'
// @ts-expect-error virtual file
import plugins from '#build/plugins'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pluginsTyped: Array<Plugin & ObjectPlugin<any>> = plugins

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

  // Provide the config of the Nuxt app
  window.__NUXT__ = {
    serverRendered: false,
    config: {
      public: {},
      app: { baseURL: '/' },
      ...runtimeConfig,
    },
    data: {},
    state: {},
  }
  // Set $fetch
  // based on https://github.com/nuxt/nuxt/blob/356173134280b66c5902e5129d2f5ee73b799352/packages/nuxt/src/core/templates.ts#L390-L403
  if (!globalThis.$fetch) {
    globalThis.$fetch = $fetch.create({
      baseURL: '/',
    })
  }

  const nuxt = createNuxtApp({
    vueApp,
    globalName: nuxtAppName,
  })
  await applyPlugins(nuxt, pluginsTyped)
  await nuxt.hooks.callHook('app:created', vueApp)
  await nuxt.hooks.callHook('app:beforeMount', vueApp)
  nuxtCtx.set(nuxt, true)

  // TODO: The following are usually called after the app is mounted
  // but currently storybook doesn't provide a hook to do that
  // await nuxt.hooks.callHook('app:mounted', vueApp)
  // await nextTick()
})
