export default defineNuxtPlugin({
  env: { storybook: false },
  name: 'env-no-storybook',
  setup() {
    return { provide: { envNoStorybook: true } }
  },
})
