import type { Import } from 'unimport'
import type { Component } from '@nuxt/schema'
import {
  findMockCalls,
  injectStoryFile,
  resolveMockedComponents,
  resolveMockedImports,
  storyImportPath,
} from '../packages/storybook-addon/src/node/mock-calls'

const FILE = 'a.stories.ts'

const STORY = `import { mockNuxtImport } from '@storybook-vue/nuxt'

mockNuxtImport('useCounter', () => () => ({ count: 40 }))
const useRoute = mockNuxtImport('useRoute', () => () => ({ fullPath: '/' }))
export const useState = mockNuxtImport('useState') as unknown
mockComponent('MyAvatar', () => import('./MyAvatar.mock.vue'))
`

/** What unimport hands out once every module has registered its imports. */
const IMPORTS: Import[] = [
  { from: '#app/composables/router', name: 'useRoute' },
  { from: '#app/composables/state', name: 'StateKey', type: true },
  {
    from: '/app/composables/useGreeting.ts',
    name: 'default',
    as: 'useGreeting',
  },
  { from: '/app/utils/old.ts', name: 'oldHelper', disabled: true },
]

const COMPONENTS = [
  {
    export: 'default',
    filePath: '/app/components/MyAvatar.vue',
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

  it('requires a factory for a component', () => {
    expect(() => findMockCalls("mockComponent('MyAvatar')", FILE)).toThrow(
      "a.stories.ts: mockComponent('MyAvatar') needs a factory",
    )
  })

  it('refuses calls that are not at the top level', () => {
    const code = `export const Mocked = {
  beforeEach() {
    mockNuxtImport('useCounter', () => () => ({ count: 40 }))
  },
}
`

    expect(() => findMockCalls(code, FILE)).toThrow(
      'a.stories.ts: mockNuxtImport() must be called at the top level',
    )
  })

  it('refuses names that are not string literals', () => {
    expect(() => findMockCalls('mockNuxtImport(name)', FILE)).toThrow(
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

  it('refuses nested component mocks too', () => {
    const code = `export const Mocked = {
  beforeEach() {
    mockComponent('MyAvatar', () => ({}))
  },
}
`

    expect(() => findMockCalls(code, FILE)).toThrow(
      'a.stories.ts: mockComponent() must be called at the top level',
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
      export const useState = mockNuxtImport('useState', "./a.stories.ts", 3) as unknown
      mockComponent('MyAvatar', () => import('./MyAvatar.mock.vue'), "./a.stories.ts", 3)
      "
    `)
    expect(map.mappings).not.toBe('')
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
      resolveMockedComponents(['MyAvatar', 'NuxtLink', 'MyMap'], COMPONENTS),
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
    expect(resolveMockedComponents(['MyChart'], COMPONENTS)).toStrictEqual([
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

    expect(resolveMockedComponents(['MyNope'], COMPONENTS)).toStrictEqual([])
    expect(warn).toHaveBeenCalledWith(
      "[nuxt-storybook] mockComponent('MyNope'): 'MyNope' is not a Nuxt component",
    )
    warn.mockRestore()
  })
})
