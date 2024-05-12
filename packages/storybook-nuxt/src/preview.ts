const vueAppRootContainer = document.createElement('div')
vueAppRootContainer.id = '__nuxt'
vueAppRootContainer.setAttribute('hidden', 'true')
document.body.appendChild(vueAppRootContainer)

// entry()
const logger = console
async function nuxtAppEntry() {
  const nuxtApp = () => import('#app/entry').then(m => m.default).catch(() => {})
  // i
  const vueAppPromise = nuxtApp().catch((_error) => {
    // consola.error('Error while mounting app:', error)
  })
  return vueAppPromise
}

nuxtAppEntry().then((app: any) => {
  logger.log('nuxtAppEntry done', app)
  app().then(() => {
    logger.log('nuxtAppEntry app done')
  }).catch(() => { logger.log('nuxtAppEntry app error') })
// app()
})

export default nuxtAppEntry
