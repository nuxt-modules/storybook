// `llms-full.txt` shows the code blocks without their hidden Twoslash setup
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', (_event, doc) => {
    stripTwoslashSetup(doc.body)
  })
})
