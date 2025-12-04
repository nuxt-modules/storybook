import { defineBuildConfig } from 'unbuild'
export default defineBuildConfig({
  entries: [
    // Default module entry (handled by nuxt-module-build)
    { input: 'src/module', name: 'module' },
    // Re-export preset and preview from @storybook-vue/nuxt
    { input: 'src/preset', name: 'preset' },
    { input: 'src/preview', name: 'preview' },
  ],
  declaration: true,
  externals: [
    // Workaround for https://github.com/sindresorhus/globby/issues/260
    'globby',
    // Esbuild cannot be bundled
    'esbuild',
    // Don't bundle the storybook-vue/nuxt package
    '@storybook-vue/nuxt',
    '@storybook-vue/nuxt/preset',
    '@storybook-vue/nuxt/preview',
  ],
  // Ignore warnings
  failOnWarn: false,
})
