import {
  extractMockedImports,
  injectImportPath,
  resolveMockedImports,
  storyImportPath,
} from '../packages/storybook-addon/src/node/mock-nuxt-import'

const FILE = 'a.stories.ts'

const STORY = `import { mockNuxtImport } from '@storybook-vue/nuxt'

mockNuxtImport('useCounter', () => () => ({ count: 40 }))
const useRoute = mockNuxtImport('useRoute', () => () => ({ fullPath: '/' }))
export const useState = mockNuxtImport('useState') as unknown
`

const USE_ROUTE = {
  as: 'useRoute',
  from: 'nuxt/app/composables/router',
  name: 'useRoute',
}

describe(extractMockedImports, () => {
  it('collects the names of the top-level calls', () => {
    expect(extractMockedImports(STORY, FILE)).toEqual([
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

    expect(() => extractMockedImports(code, FILE)).toThrow(
      'a.stories.ts: mockNuxtImport() must be called at the top level',
    )
  })

  it('refuses names that are not string literals', () => {
    expect(() => extractMockedImports('mockNuxtImport(name)', FILE)).toThrow(
      'a.stories.ts: mockNuxtImport() needs a string literal',
    )
  })
})

describe(injectImportPath, () => {
  it('appends the import path to each call', () => {
    expect(injectImportPath(STORY, FILE, './a.stories.ts')).toBe(
      `import { mockNuxtImport } from '@storybook-vue/nuxt'

mockNuxtImport('useCounter', () => () => ({ count: 40 }), "./a.stories.ts")
const useRoute = mockNuxtImport('useRoute', () => () => ({ fullPath: '/' }), "./a.stories.ts")
export const useState = mockNuxtImport('useState', "./a.stories.ts") as unknown
`,
    )
  })
})

describe(storyImportPath, () => {
  it('names the file like Storybook does in parameters.fileName', () => {
    expect(storyImportPath('/app/components/A.stories.ts', '/app')).toBe(
      './components/A.stories.ts',
    )
  })
})

describe(resolveMockedImports, () => {
  it('maps the names to their auto-imports', () => {
    const imports = new Map([['useRoute', USE_ROUTE]])

    expect(resolveMockedImports(['useRoute'], imports)).toEqual([USE_ROUTE])
  })

  it('refuses unknown names', () => {
    expect(() => resolveMockedImports(['useNope'], new Map())).toThrow(
      "'useNope' is not a Nuxt auto-import",
    )
  })
})
