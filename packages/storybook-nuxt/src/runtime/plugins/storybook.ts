import { createNuxtApp, defineNuxtPlugin } from 'nuxt/app'
import { getContext } from 'unctx'
import logger from 'consola'

import type { App } from 'vue'

// @ts-expect-error virtual file
import plugins from '#build/plugins'

const globalWindow = window as any

export default defineNuxtPlugin({
  name: 'storybook-nuxt-plugin',
  enforce: 'pre', // or 'post'

  setup(nuxtApp: any) {
    logger.info('🔌  [storybook-nuxt-plugin] setup ', nuxtApp.globalName)
    const nuxtMainApp = getContext('nuxt-app')
    if (nuxtMainApp)
      logger.info('🔌  [storybook-nuxt-plugin] setup already done ', nuxtMainApp)

    if (nuxtApp.globalName !== 'nuxt')
      return
    const applyNuxtPlugins = async (vueApp: App, storyContext: any) => {
      const nuxt = createNuxtApp({ vueApp, globalName: `nuxt-${storyContext.id}` })
      getContext('nuxt-app').set(nuxt, true)
      nuxt.$router = nuxtApp.$router
      getContext(nuxt.globalName).set(nuxt, true)

      nuxt.hooks.callHook('app:created', vueApp)
      for (const plugin of plugins) {
        try {
          if (typeof plugin === 'function' && !plugin.toString().includes('definePayloadReviver'))
            await vueApp.runWithContext(() => plugin(nuxt))
        }
        catch (e) {
          logger.info('error in plugin', plugin.name)
        }
      }
      logger.info('applyNuxtPlugins nuxt.router:', nuxt.$router)
      return nuxt
    }

    globalWindow.PLUGINS_SETUP_FUNCTIONS ||= new Set()
    globalWindow.PLUGINS_SETUP_FUNCTIONS.add(applyNuxtPlugins)
  },

  hooks: {
    'app:created': function () {
    },
  },
})
