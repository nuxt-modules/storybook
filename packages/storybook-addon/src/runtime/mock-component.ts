import { mockedComponents } from 'virtual:nuxt-storybook/mocked-imports'
import type { Component } from 'vue'
import { registerFileComponentMock } from './mocks'
import type { ComponentFactory } from './mocks'

type NuxtComponents = typeof import('#components')

type ComponentName = {
  [Name in keyof NuxtComponents]: Name extends `Lazy${string}`
    ? never
    : NuxtComponents[Name] extends Component
      ? Name
      : never
}[keyof NuxtComponents]

export type MockableComponent = [ComponentName] extends [never]
  ? string
  : ComponentName

/**
 * Mock a Nuxt component in every story of the file.
 * The factory may return a component, or import a `.vue` file.
 */
export function mockComponent(
  name: MockableComponent,
  factory: ComponentFactory,
): void
export function mockComponent(
  name: string,
  factory: ComponentFactory,
  // Injected by vite plugin
  importPath?: string,
  // Injected by vite plugin, incremented on each transform of the same file
  generation = 0,
): void {
  if (importPath === undefined) {
    throw new Error(
      `mockComponent('${name}') was not processed by the Nuxt Storybook build. Call it at the top level of a story file.`,
    )
  }
  if (!mockedComponents.includes(name)) {
    throw new Error(
      `mockComponent('${name}'): '${name}' is not a mocked Nuxt component. Check the name, and restart Storybook if the mock was added after it started.`,
    )
  }
  registerFileComponentMock(importPath, generation, name, factory)
}
