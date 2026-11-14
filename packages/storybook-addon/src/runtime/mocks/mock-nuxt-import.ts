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
 * Mock an auto import
 * @param name The name of the auto import to mock.
 * @param factory The factory function to create the mock.
 * @returns A `storybook/test` spy for the mocked import.
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
  name: string | Procedure,
  factory?: ImportFactory,
): Mock {
  if (typeof name !== 'string') {
    throw new TypeError(
      `mockNuxtImport(${name.name}) was not processed by the Nuxt Storybook build. Call it in a story file.`,
    )
  }
  const spy = spyOf(name)
  if (factory) {
    mockStoryImport(name, factory)
  }
  return spy
}

export function mockFileImport(
  importPath: string,
  // Incremented on each transform of the same file
  generation: number,
  name: string,
  factory?: ImportFactory,
): Mock {
  const spy = spyOf(name)
  if (factory) {
    registerFileMock(importPath, generation, name, factory)
  }
  return spy
}

function spyOf(name: string): Mock {
  const spy = mockedImports[name]
  if (!spy) {
    throw new Error(
      `mockNuxtImport('${name}'): '${name}' is not a mocked Nuxt auto-import.`,
    )
  }
  return spy
}
