const nuxtApp = () => import(('#app/entry')).then(m => m.default).catch(() => {})
// inject nuxt root element
const root = document.createElement('div')
root.id = '__nuxt'
root.hidden = true
document.body.appendChild(root)

const app = nuxtApp()

app.then(async (m) => {

}).catch(() => {})

export default app
