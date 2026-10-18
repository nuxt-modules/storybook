import { mockedImports } from 'virtual:nuxt-storybook/mocked-imports'
import type { Mock } from 'storybook/test'
import { registerFileMock } from './mocks'
import type { Procedure } from './mocks'

type NuxtImports = typeof import('#imports')

type MockableName = {
  [Name in keyof NuxtImports]: NuxtImports[Name] extends Procedure
    ? Name
    : never
}[keyof NuxtImports]

export type MockableImport = [MockableName] extends [never]
  ? string
  : MockableName

type ImportOf<Name> = Extract<
  Name extends keyof NuxtImports ? NuxtImports[Name] : Procedure,
  Procedure
>

/**
 * Mock an auto import.
 * Returns a `storybook/test` spy for the import.
 */
export function mockNuxtImport<Name extends MockableImport>(
  name: Name,
  factory?: () => ImportOf<Name>,
): Mock<ImportOf<Name>>
export function mockNuxtImport(
  name: string,
  factory?: () => Procedure,
  // Injected by vite plugin
  file?: string,
  // Injected by vite plugin, incremented on each transform of the same file
  generation = 0,
): Mock {
  if (file === undefined) {
    throw new Error(
      `mockNuxtImport('${name}') was not processed by the Nuxt Storybook build. Call it at the top level of a story file.`,
    )
  }
  const spy = mockedImports[name]
  if (!spy) {
    throw new Error(
      `mockNuxtImport('${name}'): '${name}' is not a mocked Nuxt auto-import. Check the name, and restart Storybook if the mock was added after it started.`,
    )
  }
  if (factory) {
    registerFileMock(file, generation, name, factory)
  }
  return spy
}
