import {  createNuxtApp, defineNuxtPlugin } from "nuxt/app"
// @ts-expect-error virtual file
import  plugins  from "#build/plugins"
import { App } from "vue";




const globalWindow = window as any;

export default defineNuxtPlugin({
    name: 'storybook-nuxt-plugin',
    enforce: 'pre', // or 'post'

    setup(nuxtApp) {
        console.log('---- nuxtApp',nuxtApp)
      if(nuxtApp.globalName !== 'nuxt')
      return
       
      const applyNuxtPlugins = async (vueApp: App,storyContext:any) => {
        const nuxt = createNuxtApp({vueApp, globalName: storyContext.id})
        
        
       nuxt.hooks.callHook('app:created', vueApp)
        for (const plugin of plugins) {
          try{
            if(typeof plugin === 'function' && !plugin.toString().includes('definePayloadReviver')){
              await vueApp.runWithContext(()  => plugin(nuxt))
            }
          }catch(e){
            console.log('error in plugin',e)
          }
        }
        console.log('1-nuxt.router  ',nuxt._router)
        nuxt._router = vueApp.config.globalProperties.$router
        console.log('2-nuxt.router  ',nuxt._route)

      
        return nuxt
      }
      
      globalWindow.STORYBOOK_VUE_GLOBAL_PLUGINS = []
      globalWindow.APPLY_PLUGINS_FUNC = applyNuxtPlugins
    },
  
    hooks: {
      'app:created'(nuxtApp)  {
      },
    }
})



