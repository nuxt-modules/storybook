const nuxtAppEntry = () => import(('#app/entry')).then(m => m.default).catch(() => {})

const logger = console
// inject nuxt root element
export const root = document.createElement('div')
root.id = '__nuxt'
root.hidden = true
document.body.appendChild(root)

const app = nuxtAppEntry()

app.then(async (m) => {
  logger.log('===== @storybook-vue/nuxt preview.ts app.then m:', m)
}).catch((error) => {
  logger.log('  app.then error:', error)
})
logger.log('===== @storybook-vue/nuxt preview.ts app:', { nuxtAppEntry }, { app })
export const config = { version: '3.0.0-alpha.0', framework: 'nuxt', renderer: 'vue3' }

export default nuxtAppEntry
