import { defineComponent } from 'vue'
import { definePreview } from './define-preview'
import type { Meta, Preview, StoryObj } from './types'

const Component = defineComponent({ props: { label: String } })

describe('csf3 parameters', () => {
  it('types parameters.nuxt on Meta, StoryObj and Preview', () => {
    const meta = {
      component: Component,
      parameters: { nuxt: { route: '/products' } },
    } satisfies Meta<typeof Component>
    const _story: StoryObj<typeof meta> = {
      parameters: { nuxt: { navigation: true } },
    }
    const _preview: Preview = { parameters: { nuxt: { route: '/' } } }

    const _badMeta: Meta<typeof Component> = {
      // @ts-expect-error route must be a string
      parameters: { nuxt: { route: 1 } },
    }
    const _badStory: StoryObj<typeof meta> = {
      // @ts-expect-error unknown nuxt parameter
      parameters: { nuxt: { rout: '/' } },
    }
  })
})

describe('runtimeConfig', () => {
  it('follows the runtime config shape', () => {
    const meta = definePreview({}).meta({ component: Component })

    meta.story({
      parameters: { nuxt: { runtimeConfig: { public: { apiBase: '/' } } } },
    })
    // @ts-expect-error public must be an object
    meta.story({ parameters: { nuxt: { runtimeConfig: { public: 1 } } } })
  })
})

describe('endpoints', () => {
  it('accepts HTTP methods in either case', () => {
    const meta = definePreview({}).meta({ component: Component })
    const handler = () => []

    meta.story({
      parameters: {
        nuxt: {
          endpoints: {
            '/a': { handler, method: 'POST' },
            '/b': { handler, method: 'post' },
          },
        },
      },
    })
    meta.story({
      parameters: {
        // @ts-expect-error not an HTTP method
        nuxt: { endpoints: { '/a': { handler, method: 'FOO' } } },
      },
    })
  })
})
