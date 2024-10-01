import type { Plugin } from 'vue'

const vTest = (el: HTMLElement, binding: any) => {
  console.log('vTest', el, binding)
}

const intentDirectivePlugin: Plugin = {
  install(app) {
    app.directive('test', vTest)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(intentDirectivePlugin)
})
