export default defineNuxtPlugin({
  name: 'env-default',
  setup() {
    return { provide: { envDefault: true } }
  },
})
