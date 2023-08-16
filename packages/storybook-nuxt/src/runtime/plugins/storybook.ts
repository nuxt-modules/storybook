import {  createNuxtApp, defineNuxtPlugin } from "nuxt/app"
import { getContext } from "unctx" 
// @ts-expect-error virtual file
import  plugins  from "#build/plugins"
import { App } from "vue";
import { Router } from "vue-router";

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
        const nuxtAppCtx = getContext('nuxt-app')
        nuxtAppCtx.set(nuxt,true);
        console.log('---- nuxtAppCtx',nuxtAppCtx)
        console.log('nuxtApp._middleware.global :',nuxtApp._middleware.global)
       nuxt.hooks.callHook('app:created', vueApp)
        for (const plugin of plugins) {
          try{
            if(typeof plugin === 'function' && !plugin.toString().includes('definePayloadReviver')){
              
            //  console.log('nuxt._middleware.global ',nuxt._middleware.global)
              await vueApp.runWithContext(()  => plugin(nuxt))
            }
          }catch(e){
            console.log('error in plugin',e)
          }
        }
      //  / vueApp.config.globalProperties.$router.removeRoute('storybook-iframe')
        nuxt._router = vueApp.config.globalProperties.$router as Router

        console.log(' nuxt._router', nuxt._router)
       
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



