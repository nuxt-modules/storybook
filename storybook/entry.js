// Vue framework entry point, based on @storybook/vue@6.0.5
// https://github.com/storybookjs/storybook/blob/next/app/vue/src/client/preview/index.ts
import Vue from 'vue'
import { start } from '@storybook/core/client'
import '@storybook/vue/dist/client/preview/globals'
import { extractProps } from '@storybook/vue/dist/client/preview/util'

/**
 * @nuxtjs/storybook
 * execute plugin scripts
 */
window.__NUXT__ = window.__NUXT__ || {}
<%= options.nuxtOptions.head.script.map(s => s.innerHTML).join("\n") %>

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

function decorateStory (
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
async function render({
  storyFn,
  kind,
  name,
  args,
  showMain,
  showError,
  showException,
  forceRender,
}) {
  if (!root) {
    // Make sure plugin scripts executes before `../index.js` import
    const { createApp } = require('../')
    const { app } = await createApp(null, {})
    
    root = new Vue({  
      ...app,
      data() {
        return {
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

const api = start(render, { decorateStory })

export const storiesOf = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m)).addParameters({
    framework
  })
}

export const configure = (...args) => api.configure(framework, ...args)
export const addDecorator = api.clientApi.addDecorator
export const addParameters = api.clientApi.addParameters
export const clearDecorators = api.clientApi.clearDecorators
export const setAddon = api.clientApi.setAddon
export const forceReRender = api.forceReRender
export const getStorybook = api.clientApi.getStorybook
export const raw = api.clientApi.raw
