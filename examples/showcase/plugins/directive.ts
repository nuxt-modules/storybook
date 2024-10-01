import type { Plugin } from 'vue'

const vTest = (el: HTMLElement, binding: any) => {
  console.log('vTest', el, binding)
  el.style.backgroundColor = 'red'
}

const intentDirectivePlugin: Plugin = {
  install(app) {
    app.directive('test', vTest)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(intentDirectivePlugin)
})
