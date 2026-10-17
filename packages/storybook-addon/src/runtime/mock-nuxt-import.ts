import { mockedImports } from 'virtual:nuxt-storybook/mocked-imports'
import type { Mock } from 'storybook/test'
import { registerFileMock } from './mocks'
import type { Procedure } from './mocks'

type NuxtImports = typeof import('#imports')

export type MockableImport = {
  [Name in keyof NuxtImports]: NuxtImports[Name] extends Procedure
    ? Name
    : never
}[keyof NuxtImports]

/**
 * Mocks a Nuxt auto-import for every story of the file, as `mockNuxtImport` of `@nuxt/test-utils` does, and returns its `storybook/test` spy.
 * The factory runs once per story.
 */
export const mockNuxtImport = register as <Name extends MockableImport>(
  name: Name | string,
  factory?: () => NuxtImports[Name],
) => Mock<NuxtImports[Name]>

function register(
  name: string,
  factory?: () => Procedure,
  // injected by the plugin
  __file?: string,
): Mock {
  if (__file === undefined) {
    throw new Error(
      `mockNuxtImport('${name}') must be called at the top level of a story file`,
    )
  }
  const spy = mockedImports[name]
  if (!spy) {
    throw new Error(
      `mockNuxtImport('${name}'): the name was not found when Storybook started. Restart it after adding mocks.`,
    )
  }
  if (factory) {
    registerFileMock(__file, name, factory)
  }
  return spy
}
