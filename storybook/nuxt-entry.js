// Vue framework entry point, based on @storybook/vue@6.0.5
// https://github.com/storybookjs/storybook/blob/next/app/vue/src/client/preview/index.ts
import Vue from 'vue'
import React from 'react'
import fetch from 'unfetch'
import '@storybook/vue/dist/esm/client/preview/globals'
import { extractProps } from '@storybook/vue/dist/esm/client/preview/util'
import fetchMixin from '../mixins/fetch.client'

/**
 * @nuxtjs/storybook
 * execute plugin scripts
 */
window.__NUXT__ = { config: <%= JSON.stringify(options.nuxtOptions.publicRuntimeConfig || {}) %> };
<%= options.nuxtOptions.head.script.map(s => s.innerHTML).join(";\n") %>

/**
 * Important: Import `createApp` after plugin scripts
 * This is required because some plugins (like color-mode) uses global scripts on import
 * link: https://github.com/nuxt-community/color-mode-module/blob/master/lib/templates/plugin.client.js#L7
 */
const { createApp } = require('../')

// Fetch mixin
if (!Vue.__nuxt__fetch__mixin__) {
  Vue.mixin(fetchMixin)
  Vue.__nuxt__fetch__mixin__ = true
}

if (!global.fetch) { global.fetch = fetch }

let root;
export const WRAPS = 'STORYBOOK_WRAPS'
export const framework = 'vue'
export const COMPONENT = 'STORYBOOK_COMPONENT';
export const VALUES = 'STORYBOOK_VALUES';

function prepare (
  rawStory,
  innerStory
) {
  let story

  if (typeof rawStory === 'string') {
    story = { template: rawStory }
  } else if (rawStory != null) {
    story = rawStory
  } else {
    return null
  }

  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  if (!story._isVue) {
    if (innerStory) {
      story.components = { ...(story.components || {}), story: innerStory }
    }
    story = Vue.extend(story)
    // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307984824
  } else if (story.options[WRAPS]) {
    return story
  }

  return Vue.extend({
    // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307985279
    [WRAPS]: story,
    // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307984824
    [VALUES]: { ...(innerStory ? innerStory.options[VALUES] : {}), ...extractProps(story) },
    functional: true,
    render (h, { data, parent, children }) {
      // Suddenly story will render twice and in the first render it isn't descendent of nuxt app
      // Ensure that story will render only inside the nuxt context
      if (!parent.$root.nuxt) return null
      return h(
        story,
        {
          ...data,
          // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307986196
          props: { ...(data.props || {}), ...parent.$root[VALUES] }
        },
        children
      )
    }
  })
}

const defaultContext = {
  id: 'unspecified',
  name: 'unspecified',
  kind: 'unspecified',
  parameters: {},
  args: {},
  argTypes: {},
  globals: {}
}

export function decorateStory (
  storyFn,
  decorators
) {
  return decorators.reduce(
    (decorated, decorator) => (context = defaultContext) => {
      let story

      const decoratedStory = decorator(
        ({ parameters, ...innerContext } = {}) => {
          story = decorated({ ...context, ...innerContext })
          return story
        },
        context
      )

      if (!story) {
        story = decorated(context)
      }

      if (decoratedStory === story) {
        return story
      }

      return prepare(decoratedStory, story)
    },
    context => prepare(storyFn(context))
  )
}

/**
 * @nuxtjs/storybook
 * Custom render function for stories
 */
export async function render({
  storyFn,
  kind,
  name,
  storyContext: { args },
  showMain,
  showError,
  showException,
  forceRender,
}) {
  if (!root) {
    const app = await getNuxtApp();

    root = new Vue({
      ...app,
      data() {
        return {
          ...app.data(),
          [COMPONENT]: undefined,
          [VALUES]: {},
        };
      },
      render(h) {
        const children = this[COMPONENT] ? [h(this[COMPONENT])] : undefined;
        return h('div', { attrs: { id: 'root' } }, children);
      },
    })
    window.$nuxt = root;
  }
  Vue.config.errorHandler = showException;

  // FIXME: move this into root[COMPONENT] = element
  // once we get rid of knobs so we don't have to re-create
  // a new component each time
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Vue component from the story: "${name}" of "${kind}".`,
      description: `
        Did you forget to return the Vue component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return;
  }

  showMain();

  // at component creation || refresh by HMR or switching stories
  if (!root[COMPONENT] || !forceRender) {
    root[COMPONENT] = element;
  }

  // @ts-ignore https://github.com/storybookjs/storrybook/pull/7578#discussion_r307986139
  root[VALUES] = { ...element.options[VALUES], ...args };

  if (!root.$el) {
    root.$mount('#root');
  }
}

/**
 * use `createApp` to create nuxt context and cache in `__NUXT_APP`
 */
export async function getNuxtApp() {
    if (!window.__NUXT_APP) {
        // Make sure plugin scripts executes before `../index.js` import
        const { app } = await createApp(null, __NUXT__.config)
        window.__NUXT_APP = app;
    }
    return window.__NUXT_APP;
}


// based on: https://github.com/storybookjs/storybook/blob/master/addons/docs/src/frameworks/vue/prepareForInline.ts
export function prepareForInline (storyFn, { args }) {
  const el = React.useRef(null)
  // FIXME: This recreates the Vue instance every time, which should be optimized
  React.useEffect(() => {
    let root
    const __NUXT_APP = getNuxtApp()
    __NUXT_APP.then((app) => {
      const component = storyFn()
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