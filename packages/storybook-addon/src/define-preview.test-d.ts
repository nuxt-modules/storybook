import { defineComponent } from 'vue'
import { defineMain } from './node'
import { definePreview } from './define-preview'
import type { NuxtParameters } from './types'

const Component = defineComponent({ props: { label: String } })

describe('definePreview', () => {
  it('types the nuxt parameters of meta and stories', () => {
    const preview = definePreview({
      parameters: { nuxt: { route: '/' } },
    })
    const meta = preview.meta({
      component: Component,
      parameters: { nuxt: { navigation: true } },
    })
    const story = meta.story({
      parameters: { nuxt: { runtimeConfig: { public: { apiBase: '/' } } } },
    })

    expectTypeOf(story.input.parameters.nuxt).toExtend<
      NuxtParameters | undefined
    >()
    // @ts-expect-error route must be a string
    preview.meta({ component: Component, parameters: { nuxt: { route: 1 } } })
  })
  it('accepts user addons', () => {
    definePreview({ addons: [{ parameters: { layout: 'centered' } }] })
  })
})

describe('defineMain', () => {
  it('restricts the framework name', () => {
    defineMain({ framework: '@storybook-vue/nuxt', stories: [] })
    // @ts-expect-error another framework
    defineMain({ framework: '@storybook/vue3-vite', stories: [] })
  })
})
