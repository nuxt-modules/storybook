import type { Import } from 'unimport'
import type { Component } from '@nuxt/schema'
import {
  createComponentResolver,
  findMockCalls,
  injectStoryFile,
  resolveMockedComponents,
  resolveMockedImports,
  storyImportPath,
} from '../packages/storybook-addon/src/node/mocks/calls'

const FILE = 'a.stories.ts'

const STORY = `import { mockNuxtImport } from '@storybook-vue/nuxt'

mockNuxtImport('useCounter', () => () => ({ count: 40 }))
const useRoute = mockNuxtImport('useRoute', () => () => ({ fullPath: '/' }))
export const useState = mockNuxtImport('useState') as unknown
mockComponent('MyAvatar', () => import('./MyAvatar.mock.vue'))
`

const IMPORTS: Import[] = [
  { from: '#app/composables/router', name: 'useRoute' },
  { from: '#app/composables/state', name: 'StateKey', type: true },
  {
    as: 'useGreeting',
    from: '/app/composables/useGreeting.ts',
    name: 'default',
  },
  { disabled: true, from: '/app/utils/old.ts', name: 'oldHelper' },
]

const COMPONENTS = [
  {
    export: 'default',
    filePath: '/app/components/MyAvatar.vue',
    kebabName: 'my-avatar',
    mode: 'all',
    pascalName: 'MyAvatar',
  },
  {
    export: 'default',
    filePath: '/nuxt/app/components/nuxt-link',
    pascalName: 'NuxtLink',
  },
  {
    export: 'default',
    filePath: '/app/components/MyChart.server.vue',
    mode: 'server',
    pascalName: 'MyChart',
  },
  {
    export: 'default',
    filePath: '/app/components/MyMap.client.vue',
    mode: 'client',
    pascalName: 'MyMap',
  },
  {
    _raw: true,
    export: 'default',
    filePath: '/nuxt/server-placeholder',
    mode: 'server',
    pascalName: 'MyMap',
  },
] as Component[]

const resolveComponent = createComponentResolver(COMPONENTS, { '~': '/app' })

function references(...names: string[]) {
  return names.map((name) => ({ file: `/app/components/${FILE}`, name }))
}

describe(findMockCalls, () => {
  it('collects the names of the top-level calls, by kind', () => {
    expect(
      findMockCalls(STORY, FILE).map(({ kind, name }) => [kind, name]),
    ).toStrictEqual([
      ['imports', 'useCounter'],
      ['imports', 'useRoute'],
      ['imports', 'useState'],
      ['components', 'MyAvatar'],
    ])
  })

  it('requires the mock of a component', () => {
    expect(() => findMockCalls("mockComponent('MyAvatar')", FILE)).toThrow(
      "a.stories.ts: mockComponent('MyAvatar') needs the mock component",
    )
  })

  it('collects the names of the calls of story hooks, which may repeat', () => {
    const code = `mockNuxtImport(useCounter)
export const A = {
  beforeEach() {
    mockNuxtImport('useCounter', () => () => ({ count: 40 }))
    mockComponent('MyAvatar', () => ({}))
  },
}
export const B = { play: () => mockNuxtImport('useCounter', factory) }
`

    expect(
      findMockCalls(code, FILE).map(({ kind, name }) => [kind, name]),
    ).toStrictEqual([
      ['imports', 'useCounter'],
      ['imports', 'useCounter'],
      ['components', 'MyAvatar'],
      ['imports', 'useCounter'],
    ])
  })

  it('refuses names that are not string literals', () => {
    expect(() => findMockCalls('mockNuxtImport(names[0])', FILE)).toThrow(
      'a.stories.ts: mockNuxtImport() needs a string literal',
    )
  })

  it('refuses a name mocked twice in the same file', () => {
    const code = `mockNuxtImport('useCounter', a)
mockNuxtImport('useCounter', b)
`

    expect(() => findMockCalls(code, FILE)).toThrow(
      "a.stories.ts: 'useCounter' is mocked twice",
    )
  })

  it('refuses a component named by an identifier', () => {
    expect(() => findMockCalls('mockComponent(MyAvatar, mock)', FILE)).toThrow(
      'a.stories.ts: mockComponent() needs a string literal',
    )
  })
})

describe(injectStoryFile, () => {
  it('appends the import path and the generation to each call', () => {
    const { code, map } = injectStoryFile(STORY, FILE, './a.stories.ts', 3)

    expect(code).toMatchInlineSnapshot(`
      "import { mockNuxtImport } from '@storybook-vue/nuxt'

      mockNuxtImport('useCounter', () => () => ({ count: 40 }), "./a.stories.ts", 3)
      const useRoute = mockNuxtImport('useRoute', () => () => ({ fullPath: '/' }), "./a.stories.ts", 3)
      export const useState = mockNuxtImport('useState', undefined, "./a.stories.ts", 3) as unknown
      mockComponent('MyAvatar', () => import('./MyAvatar.mock.vue'), "./a.stories.ts", 3)
      "
    `)
    expect(map.mappings).not.toBe('')
  })

  it('names the mocks as the runtime does, and leaves those of story hooks to their story', () => {
    const story = `mockNuxtImport(useRoute)
mockComponent('~/components/MyAvatar.vue', MockAvatar)
export const A = {
  beforeEach() {
    mockNuxtImport(useRoute, () => useMockedRoute)
    mockComponent('my-avatar', MockAvatar)
  },
}
`

    expect(
      injectStoryFile(story, FILE, './a.stories.ts', 1, resolveComponent).code,
    ).toMatchInlineSnapshot(`
      "mockNuxtImport("useRoute", undefined, "./a.stories.ts", 1)
      mockComponent("MyAvatar", MockAvatar, "./a.stories.ts", 1)
      export const A = {
        beforeEach() {
          mockNuxtImport("useRoute", () => useMockedRoute)
          mockComponent("MyAvatar", MockAvatar)
        },
      }
      "
    `)
  })

  it('tells top-level registerEndpoint calls their file, not those of story hooks', () => {
    const story = `import { registerEndpoint } from '@storybook-vue/nuxt'

registerEndpoint('/api/users', () => ['Ada'])

export default {
  beforeEach: (context) => registerEndpoint(context, '/api/me', () => ({})),
}
`

    expect(injectStoryFile(story, FILE, './a.stories.ts', 3).code)
      .toMatchInlineSnapshot(`
        "import { registerEndpoint } from '@storybook-vue/nuxt'

        registerEndpoint('/api/users', () => ['Ada'], "./a.stories.ts", 3)

        export default {
          beforeEach: (context) => registerEndpoint(context, '/api/me', () => ({})),
        }
        "
      `)
  })

  it('refuses a top-level registerEndpoint without url and endpoint', () => {
    expect(() =>
      injectStoryFile("registerEndpoint('/api/me')", FILE, './a.stories.ts', 1),
    ).toThrow('a.stories.ts: registerEndpoint() needs a url and an endpoint')
  })
})

describe(storyImportPath, () => {
  it('names the file like Storybook does in parameters.fileName', () => {
    expect(storyImportPath('/app/components/A.stories.ts', '/app')).toBe(
      './components/A.stories.ts',
    )
    expect(storyImportPath('/lib/A.stories.ts', '/app/storybook')).toBe(
      '../../lib/A.stories.ts',
    )
  })
})

describe(resolveMockedImports, () => {
  it('maps the names to their runtime auto-imports', () => {
    expect(
      resolveMockedImports(['useRoute', 'useGreeting'], IMPORTS),
    ).toStrictEqual([
      { as: 'useRoute', from: '#app/composables/router', name: 'useRoute' },
      {
        as: 'useGreeting',
        from: '/app/composables/useGreeting.ts',
        name: 'default',
      },
    ])
  })

  it('warns about unknown, type-only and disabled names and skips them', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(
      resolveMockedImports(['useNope', 'StateKey', 'oldHelper'], IMPORTS),
    ).toStrictEqual([])
    expect(warn.mock.calls.map(([message]) => message)).toStrictEqual([
      "[nuxt-storybook] mockNuxtImport('useNope'): 'useNope' is not a Nuxt auto-import",
      "[nuxt-storybook] mockNuxtImport('StateKey'): 'StateKey' is not a Nuxt auto-import",
      "[nuxt-storybook] mockNuxtImport('oldHelper'): 'oldHelper' is not a Nuxt auto-import",
    ])
    warn.mockRestore()
  })
})

describe(resolveMockedComponents, () => {
  it('maps the names to the component files, preferring the client version', () => {
    expect(
      resolveMockedComponents(
        references('my-avatar', 'NuxtLink', './MyMap.client.vue'),
        resolveComponent,
      ),
    ).toStrictEqual([
      {
        filePath: '/app/components/MyAvatar.vue',
        name: 'default',
        pascalName: 'MyAvatar',
        server: false,
      },
      {
        filePath: '/nuxt/app/components/nuxt-link',
        name: 'default',
        pascalName: 'NuxtLink',
        server: false,
      },
      {
        filePath: '/app/components/MyMap.client.vue',
        name: 'default',
        pascalName: 'MyMap',
        server: false,
      },
    ])
  })

  it('marks server-only components, which Nuxt renders as islands', () => {
    expect(
      resolveMockedComponents(references('MyChart'), resolveComponent),
    ).toStrictEqual([
      {
        filePath: '/app/components/MyChart.server.vue',
        name: 'default',
        pascalName: 'MyChart',
        server: true,
      },
    ])
  })

  it('warns about unknown names and skips them', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(
      resolveMockedComponents(references('MyNope'), resolveComponent),
    ).toStrictEqual([])
    expect(warn).toHaveBeenCalledWith(
      "[nuxt-storybook] mockComponent('MyNope'): 'MyNope' is not a Nuxt component",
    )
    warn.mockRestore()
  })
})
