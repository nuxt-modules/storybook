import React from 'react'
import Vue from 'vue'
import '~storybook';

<% if (options.nuxtOptions.components) { %>import * as components from '../components';
Object.keys(components).forEach(name => Vue.component(name, components[name]))<% } %>;


// based on: https://github.com/storybookjs/storybook/blob/master/addons/docs/src/frameworks/vue/prepareForInline.ts
const COMPONENT = 'STORYBOOK_COMPONENT';
const VALUES = 'STORYBOOK_VALUES';
const prepareForInline = (storyFn, { args }) => {
  const component = storyFn()
  const el = React.useRef(null)
  // FIXME: This recreates the Vue instance every time, which should be optimized
  React.useEffect(() => {
    let root
    const __NUXT_APP = Promise.resolve(window.__NUXT_APP || require('../').createApp(null, window.__NUXT__.config))
    __NUXT_APP.then(({ app }) => {
      root = new Vue({
        ...app,
        el: el.current,
        data () {
          return {
            [COMPONENT]: component,
            [VALUES]: args
          }
        },
        render (h) {
          const children = this[COMPONENT] ? [h(this[COMPONENT])] : undefined
          return h('div', { attrs: { id: 'root' } }, children)
        }
      })
    })
    return () => root && root.$destroy()
  })

  return React.createElement('div', null, React.createElement('div', { ref: el }))
}

const globalParameters = <%= devalue(options.parameters) %>;
globalParameters.docs = {
    ...globalParameters.docs,
    prepareForInline
}
export const parameters = globalParameters
