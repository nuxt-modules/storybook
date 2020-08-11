export default {
  components: true,
  storybook: {
    stories: [
      '~/components/**/*.stories.mdx'
    ],
    addons: [
      '@storybook/addon-knobs/preset',
      '@storybook/addon-docs'
    ]
  }
}
