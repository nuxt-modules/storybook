import { describe, expectTypeOf, test } from 'vitest'
import type { StorybookConfig } from './types'

describe('StorybookConfig', () => {
  test('should restrict framework name', () => {
    expectTypeOf<StorybookConfig>()
      .toHaveProperty('framework')
      .extract<string>()
      .toEqualTypeOf<'@storybook-vue/nuxt'>()
    expectTypeOf<StorybookConfig>()
      .toHaveProperty('framework')
      .extract<{ name: string }>()
      .toHaveProperty('name')
      .toEqualTypeOf<'@storybook-vue/nuxt'>()
  })
  test('should restrict builder name', () => {
    expectTypeOf<StorybookConfig>()
      .toHaveProperty('core')
      .exclude<undefined>()
      .toHaveProperty('builder')
      .extract<string>()
      .toEqualTypeOf<'@storybook/builder-vite'>()

    expectTypeOf<StorybookConfig>()
      .toHaveProperty('core')
      .exclude<undefined>()
      .toHaveProperty('builder')
      .extract<{ name: string }>()
      .toHaveProperty('name')
      .toEqualTypeOf<'@storybook/builder-vite'>()
  })
  test('should allow setting docgen option', () => {
    const _config: StorybookConfig = {
      stories: [],
      framework: {
        name: '@storybook-vue/nuxt',
        options: {
          docgen: 'vue-component-meta',
        },
      },
    }
  })
  test('should allow setting staticDirs', () => {
    const _config: StorybookConfig = {
      stories: [],
      framework: '@storybook-vue/nuxt',
      staticDirs: ['public'],
    }
  })
})
