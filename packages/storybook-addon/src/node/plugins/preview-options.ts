import type { RuntimeConfig } from '@nuxt/schema'
import type { Plugin } from 'vite'
import { createUnplugin } from 'unplugin'
export interface PreviewOptions {
  runtimeConfig: RuntimeConfig
}

const VIRTUAL_ID = 'virtual:nuxt-storybook/options'

export const previewOptionsPlugin = (options: PreviewOptions) => createUnplugin(() =>  ({
  name: 'nuxt-storybook-preview-options',
  resolveId(id) {
    if (id === VIRTUAL_ID) {
      return id
    }
  },
  load(id) {
    if (id === VIRTUAL_ID) {
      return `export const runtimeConfig = ${JSON.stringify(options.runtimeConfig)}`
    }
  },
}))