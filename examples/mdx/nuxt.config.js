export default {
  components: true,
  storybook: {
    stories: [
      '~/components/**/*.stories.mdx'
    ],
    addons: [
      '@storybook/addon-controls',
      '@storybook/addon-docs'
    ]
  }
}
