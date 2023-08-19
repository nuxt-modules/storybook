import { createNuxtApp, defineNuxtPlugin } from 'nuxt/app'
import { getContext } from 'unctx'

// @ts-expect-error virtual file
import type { App } from 'vue'
import plugins from '#build/plugins'

const globalWindow = window as any

export default defineNuxtPlugin({
  name: 'storybook-nuxt-plugin',
  enforce: 'pre', // or 'post'

  setup(nuxtApp: any) {
    if (nuxtApp.globalName !== 'nuxt')
      return

    const applyNuxtPlugins = async (vueApp: App, storyContext: any) => {
      const nuxt = createNuxtApp({ vueApp, globalName: `nuxt-${storyContext.id}` })
      const nuxtAppCtx = getContext('nuxt-app')
      nuxtAppCtx.set(nuxt, true)

      nuxt.hooks.callHook('app:created', vueApp)

      for (const plugin of plugins) {
        try {
          if (typeof plugin === 'function' && !plugin.toString().includes('definePayloadReviver')) {
            //  //console.log('nuxt._middleware.global ',nuxt._middleware.global)
            await vueApp.runWithContext(() => plugin(nuxt))
          }
        }
        catch (e) {
          // //console.log('error in plugin', e)
        }
      }

      // nuxt._router = vueApp.config.globalProperties.$router as Route

      return nuxt
    }

    globalWindow.STORYBOOK_VUE_GLOBAL_PLUGINS = []
    globalWindow.APPLY_PLUGINS_FUNC = applyNuxtPlugins
  },

  hooks: {
    'app:created': function () {
    },
  },
})
