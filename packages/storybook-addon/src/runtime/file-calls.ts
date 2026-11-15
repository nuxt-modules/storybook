/*
 * What the build makes of the top-level calls of a story file, which apply to
 * every story of the file:
 *
 *   mockNuxtImport('useRoute', factory)
 *   // becomes
 *   __nuxtStorybookFile.mockNuxtImport('./a.stories.ts', 3, 'useRoute', factory)
 */
export { registerFileEndpoint as registerEndpoint } from './endpoints/registry'
export { mockFileComponent as mockComponent } from './mocks/mock-component'
export { mockFileImport as mockNuxtImport } from './mocks/mock-nuxt-import'
