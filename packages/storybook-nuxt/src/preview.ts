const nuxtApp = () => import(('#app/entry')).then(m => m.default).catch(() => {})
const c = console
// inject nuxt root element
const root = document.createElement('div')
root.id = '__nuxt'
root.hidden = true
document.body.appendChild(root)

const app = nuxtApp()

app.then(async (m) => {
  const vueApp = await m()
  c.log('=====storybook-vue/nuxt preview.ts app.then vueApp:', vueApp)
}).catch(() => {})

export default app
