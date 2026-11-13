import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const PLAYGROUND = fileURLToPath(new URL('../playground/', import.meta.url))

/** Resolved from the playground, which is where Storybook runs. */
const require = createRequire(PLAYGROUND)

describe('csf factories', () => {
  it('detects the playground preview as a CSF Factories preview', async () => {
    const { isCsfFactoryPreview, readConfig } = await import(
      pathToFileURL(require.resolve('storybook/internal/csf-tools')).href
    )
    const preview = await readConfig(`${PLAYGROUND}.storybook/preview.ts`)

    expect(isCsfFactoryPreview(preview)).toBe(true)
  })

  it('exposes defineMain on @storybook-vue/nuxt/node, where the codemod imports it', async () => {
    const { defineMain } = await import(
      await resolveExport('@storybook-vue/nuxt', './node')
    )
    const config = { framework: '@storybook-vue/nuxt', stories: [] }

    expect(defineMain(config)).toBe(config)
  })
})

async function resolveExport(name: string, subpath: string) {
  const manifest = require.resolve(`${name}/package.json`)
  const { exports } = JSON.parse(await readFile(manifest, 'utf8'))
  return pathToFileURL(join(dirname(manifest), exports[subpath].import)).href
}
