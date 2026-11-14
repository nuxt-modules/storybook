import { mockedImports } from 'virtual:nuxt-storybook/mocked-imports'
import type { Mock } from 'storybook/test'
import { mockStoryImport, registerFileMock } from './registry'
import type { ImportFactory, Procedure } from './registry'

type NuxtImports = typeof import('#imports')

type MockableName = {
  [Name in keyof NuxtImports]: [NuxtImports[Name]] extends [Procedure]
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
 * Mock an auto import, named by a string or by the import itself: in every
 * story of the file, or in the story of the hook calling it.
 * Returns a `storybook/test` spy for the import.
 */
export function mockNuxtImport<Name extends MockableImport>(
  name: Name,
  factory?: ImportFactory<ImportOf<Name>>,
): Mock<ImportOf<Name>>
export function mockNuxtImport<T extends Procedure>(
  target: T,
  factory?: ImportFactory<T>,
): Mock<T>
export function mockNuxtImport(
  name: string,
  factory?: ImportFactory,
  importPath?: string,
  // Injected by vite plugin, incremented on each transform of the same file
  generation = 0,
): Mock {
  const spy = mockedImports[name]
  if (!spy) {
    throw new Error(
      `mockNuxtImport('${name}'): '${name}' is not a mocked Nuxt auto-import. Check the name, and restart Storybook if the mock was added after it started.`,
    )
  }
  if (factory && importPath === undefined) {
    mockStoryImport(name, factory)
  } else if (factory && importPath !== undefined) {
    registerFileMock(importPath, generation, name, factory)
  }
  return spy
}
