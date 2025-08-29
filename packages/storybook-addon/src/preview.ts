/**
 * This is loaded by the Storybook canvas preview iframe and applies to all stories.
 * https://github.com/storybookjs/storybook/blob/main/docs/contribute/framework.md#4-author-the-framework-itself
 * https://github.com/storybookjs/storybook/blob/main/docs/configure/index.md#configure-story-rendering
 *
 * We use it to load the Nuxt app in the preview iframe.
 * This should contain the same setup as what Nuxt does in the background.
 * https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/entry.ts
 */

import { setup } from '@storybook/vue3-vite'
import type { ObjectPlugin, Plugin, NuxtApp } from 'nuxt/app'
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

setup(async (_vueApp, storyContext) => {
  const vueApp = _vueApp as unknown as NuxtApp['vueApp']
  // We key the Nuxt apps to the id of the story
  // This is not totally correct, since the storybook vue renderer actually uses the canvas element
  // Also this doesn't allow to "forceRemount"
  // TODO: Improve this (needs PR to storybook to pass the necessary infos to this function)

  // use storyContext.canvasElement.id as key as it's unique for each rendered story
  // storyContext.id is same for 2 stories in Docs mode, Primary story and the first story in stories are the same story and have the same id
  const key = storyContext?.canvasElement.id
  if (!key) {
    throw new Error('StoryContext is not provided')
  }

  // Create a new nuxt app for each story
  const storyNuxtAppId = `nuxt-app-${key}`
  const storyNuxtCtx = getContext(storyNuxtAppId)

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any
  }

  const nuxt = createNuxtApp({
    id: storyNuxtAppId,
    vueApp,
  })

  // Provide the Nuxt app as context
  storyNuxtCtx.set(nuxt, true)
  // ...also for calls of useNuxtApp with the default key
  getContext('nuxt-app').set(nuxt, true)

  await applyPlugins(nuxt, pluginsTyped)
  await nuxt.hooks.callHook('app:created', vueApp)
  await nuxt.hooks.callHook('app:beforeMount', vueApp)

  // TODO: The following are usually called after the app is mounted
  // but currently storybook doesn't provide a hook to do that
  // await nuxt.hooks.callHook('app:mounted', vueApp)
  // await nextTick()
})
