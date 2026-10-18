import type { Import } from 'unimport'
import {
  extractMockedNames,
  injectStoryFile,
  resolveMockedImports,
  storyImportPath,
} from '../packages/storybook-addon/src/node/mock-calls'

const FILE = 'a.stories.ts'

const STORY = `import { mockNuxtImport } from '@storybook-vue/nuxt'

mockNuxtImport('useCounter', () => () => ({ count: 40 }))
const useRoute = mockNuxtImport('useRoute', () => () => ({ fullPath: '/' }))
export const useState = mockNuxtImport('useState') as unknown
`

/** What unimport hands out once every module has registered its imports. */
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

describe(extractMockedNames, () => {
  it('collects the names of the top-level calls', () => {
    expect(extractMockedNames(STORY, FILE)).toStrictEqual([
      'useCounter',
      'useRoute',
      'useState',
    ])
  })

  it('refuses calls that are not at the top level', () => {
    const code = `export const Mocked = {
  beforeEach() {
    mockNuxtImport('useCounter', () => () => ({ count: 40 }))
  },
}
`

    expect(() => extractMockedNames(code, FILE)).toThrow(
      'a.stories.ts: mockNuxtImport() must be called at the top level',
    )
  })

  it('refuses names that are not string literals', () => {
    expect(() => extractMockedNames('mockNuxtImport(name)', FILE)).toThrow(
      'a.stories.ts: mockNuxtImport() needs a string literal',
    )
  })

  it('refuses a name mocked twice in the same file', () => {
    const code = `mockNuxtImport('useCounter', a)
mockNuxtImport('useCounter', b)
`

    expect(() => extractMockedNames(code, FILE)).toThrow(
      "a.stories.ts: 'useCounter' is mocked twice",
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
