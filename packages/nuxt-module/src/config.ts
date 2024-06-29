import { resolve } from 'node:path'

export function generateConfigFiles(configDir: string) {
  const isTsProject = isTypescriptProject()
  const extension = isTsProject ? '.ts' : '.js'
  const mainFile = resolve(configDir, 'main' + extension)
  const previewFile = resolve(configDir, 'preview' + extension)
}

function generateMainConfig({ useTypescript }) {
  const preamble = useTypescript
    ? ``
    : `
/** @type { import('storybook-vue').StorybookConfig } */
const config = {
`
  return (
    preamble +
    `
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}
export default config
  `
  )
}

function isTypescriptProject() {
  return true
}
