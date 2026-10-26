import { tryUseNuxtApp } from 'nuxt/app'
import { defineComponent, h } from 'vue'
import type { Component } from 'vue'
import { resolveMockedComponent } from './mocks'

export function mockableComponent(
  name: string,
  original: Component,
): Component {
  return defineComponent({
    inheritAttrs: false,
    name,
    setup(_props, { attrs, slots }) {
      const nuxt = tryUseNuxtApp()
      const mock = nuxt ? resolveMockedComponent(nuxt, name) : undefined
      return () => h(mock ?? original, attrs, slots)
    },
  })
}
