import { applyPlugins, createNuxtApp } from 'nuxt/app'
import { createApp, defineComponent, nextTick } from 'vue'
import consola from 'consola'

import '#build/css'

// @ts-expect-error virtual file
import plugins from '#build/plugins'

// inject nuxt root element
let vueAppPromise: Promise<any>

const RootComponent = defineComponent({
  template: '<div></div>',
})

const vueAppRootContainer = document.createElement('div')
vueAppRootContainer.id = '__nuxt'
document.body.appendChild(vueAppRootContainer)

async function initApp() {
  if (vueAppPromise)
    return vueAppPromise

  const vueApp = createApp(RootComponent)

  const nuxt = createNuxtApp({ vueApp })

  // Define plugins as an array of Plugin type

  try {
    await applyPlugins(nuxt, plugins)
  }
  catch (err) {
    await nuxt.callHook('app:error', err)
    consola.error('Error while applying plugins:', err)
  }

  try {
    await nuxt.hooks.callHook('app:created', vueApp)
    await nuxt.hooks.callHook('app:beforeMount', vueApp)
    vueApp.mount(vueAppRootContainer)
    await nuxt.hooks.callHook('app:mounted', vueApp)
    await nextTick()
  }
  catch (err) {
    await nuxt.callHook('app:error', err)
    consola.error('Error while mounting app:', err)
    // nuxt.payload.error = nuxt.payload.error || err
  }

  return vueApp
}

async function nuxtAppEntry() {
  vueAppPromise = initApp().catch((error) => {
    consola.error('Error while mounting app:', error)
  })
  return vueAppPromise
}

nuxtAppEntry().then((app) => {
  consola.info('nuxtAppEntry done', app)
})
