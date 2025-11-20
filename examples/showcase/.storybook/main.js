/** @type { import('storybook-vue').StorybookConfig } */
const config = {
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../pages/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        csfPluginOptions: null,
        mdxPluginOptions: {},
      },
    },
    '@chromatic-com/storybook',
    '@storybook/addon-links',
  ],
  async viteFinal(config) {
    // Pre-bundle dependencies to avoid race condition on initial load
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include || []),
        '@storybook/vue3-vite',
        '@storybook/vue3/entry-preview',
        'react/jsx-runtime',
        'react',
        'react-dom/client',
      ],
      // Force pre-bundling on every start to ensure deps are ready
      force: true,
    }
    // Disable dependency pre-bundling optimization during dev for more stability
    config.server = {
      ...config.server,
      fs: {
        ...config.server?.fs,
        strict: false,
      },
    }

    return config
  },
  docs: {
    autodocs: 'tag',
  },
}
export default config
