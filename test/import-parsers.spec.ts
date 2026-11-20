import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { isAbsolute, relative, resolve } from 'pathe'
import type { ImportEdge } from 'storybook/internal/core-server'
import { nuxtImportParsers } from '../packages/storybook-addon/src/node/import-parsers'
import { loadNuxtViteConfig } from '../packages/storybook-addon/src/node/load-nuxt'

const playgroundDir = fileURLToPath(new URL('../playground', import.meta.url))

// Storybook's own parsers find the explicit imports
const storybookEdge: ImportEdge = {
  importedNames: new Set(['ref']),
  kind: 'static',
  specifier: 'vue',
}
const vueParser = { extensions: ['.vue'], parse: async () => [storybookEdge] }
const context = { parseScriptWithOxc: async () => [] }

let loaded: ReturnType<typeof loadNuxtViteConfig>

beforeAll(() => {
  loaded = loadNuxtViteConfig(playgroundDir)
}, 120_000)

// Paths relative to the playground, and Nuxt's own files to the package
function readable(specifier: string): string {
  if (!isAbsolute(specifier)) {
    return specifier
  }
  const [, nuxtFile] = specifier.split('/node_modules/nuxt/')
  return nuxtFile ? `nuxt/${nuxtFile}` : relative(playgroundDir, specifier)
}

async function parse(file: string) {
  const { components, unimport } = await loaded
  const filePath = resolve(playgroundDir, file)
  const parser = nuxtImportParsers([vueParser], components, unimport).findLast(
    ({ extensions }) => extensions.some((ext) => filePath.endsWith(ext)),
  )
  const source = await readFile(filePath, 'utf8')
  const edges = await parser?.parse({ filePath, source }, context)
  return edges?.map((edge) =>
    Object.assign(edge, { specifier: readable(edge.specifier) }),
  )
}

describe(nuxtImportParsers, () => {
  it(
    'follows the auto-imports and the components of the script and the template',
    { timeout: 120_000 },
    async () => {
      expect(await parse('components/MyNuxtNavigate.vue'))
        .toMatchInlineSnapshot(`
        [
          {
            "importedNames": Set {
              "ref",
            },
            "kind": "static",
            "specifier": "vue",
          },
          {
            "importedNames": Set {
              "useRoute",
              "navigateTo",
            },
            "kind": "static",
            "specifier": "#app/composables/router",
          },
          {
            "importedNames": Set {
              "default",
            },
            "kind": "static",
            "specifier": "components/MyButton.vue",
          },
        ]
      `)
    },
  )

  it(
    'follows the auto-imported composables of the project',
    { timeout: 120_000 },
    async () => {
      expect(await parse('components/MyNuxtGreeting.vue'))
        .toMatchInlineSnapshot(`
        [
          {
            "importedNames": Set {
              "ref",
            },
            "kind": "static",
            "specifier": "vue",
          },
          {
            "importedNames": Set {
              "computed",
            },
            "kind": "static",
            "specifier": "vue",
          },
          {
            "importedNames": Set {
              "default",
            },
            "kind": "static",
            "specifier": "composables/useGreeting.ts",
          },
        ]
      `)
    },
  )

  it('follows server components', { timeout: 120_000 }, async () => {
    expect(await parse('components/MyNuxtIslandHost.vue'))
      .toMatchInlineSnapshot(`
      [
        {
          "importedNames": Set {
            "ref",
          },
          "kind": "static",
          "specifier": "vue",
        },
        {
          "importedNames": Set {
            "default",
          },
          "kind": "static",
          "specifier": "components/MyNuxtIsland.server.vue",
        },
      ]
    `)
  })

  it(
    'follows every mode of the components Nuxt registers',
    { timeout: 120_000 },
    async () => {
      expect(await parse('app.vue')).toMatchInlineSnapshot(`
        [
          {
            "importedNames": Set {
              "ref",
            },
            "kind": "static",
            "specifier": "vue",
          },
          {
            "importedNames": Set {
              "default",
            },
            "kind": "static",
            "specifier": "nuxt/dist/app/components/nuxt-route-announcer.js",
          },
          {
            "importedNames": Set {
              "default",
            },
            "kind": "static",
            "specifier": "nuxt/dist/app/components/server-placeholder.js",
          },
          {
            "importedNames": Set {
              "default",
            },
            "kind": "static",
            "specifier": "nuxt/dist/app/components/welcome.vue",
          },
        ]
      `)
    },
  )

  it(
    'follows the auto-imports of script files',
    { timeout: 120_000 },
    async () => {
      expect(await parse('plugins/env-default.ts')).toMatchInlineSnapshot(`
        [
          {
            "importedNames": Set {
              "defineNuxtPlugin",
            },
            "kind": "static",
            "specifier": "#app/nuxt",
          },
        ]
      `)
    },
  )
})
