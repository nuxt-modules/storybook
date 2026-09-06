import type { StorybookConfig } from './types'

describe('storybookConfig', () => {
  it('should restrict framework name', () => {
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
  it('should restrict builder name', () => {
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
  it('should allow setting docgen option', () => {
    const _config: StorybookConfig = {
      framework: {
        name: '@storybook-vue/nuxt',
        options: {
          docgen: 'vue-component-meta',
        },
      },
      stories: [],
    }
  })
  it('should allow setting staticDirs', () => {
    const _config: StorybookConfig = {
      framework: '@storybook-vue/nuxt',
      staticDirs: ['public'],
      stories: [],
    }
  })
})
