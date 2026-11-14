import { mockedComponents } from 'virtual:nuxt-storybook/mocked-imports'
import type { Component } from 'vue'
import { mockStoryComponent, registerFileComponentMock } from './registry'
import type { ComponentMock } from './registry'

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
 * Mock a Nuxt component, named by its name or its path: in every story of the
 * file, or in the story of the hook calling it, before it renders.
 * Takes the mock component, or a factory returning or importing it.
 */
export function mockComponent(
  name: MockableComponent | (string & Record<never, never>),
  component: ComponentMock,
): void
export function mockComponent(
  name: string,
  component: ComponentMock,
  // Injected by vite plugin, at the top level of a story file
  importPath?: string,
  // Injected by vite plugin, incremented on each transform of the same file
  generation = 0,
): void {
  if (!mockedComponents.includes(name)) {
    throw new Error(
      `mockComponent('${name}'): '${name}' is not a mocked Nuxt component. Check the name, and restart Storybook if the mock was added after it started.`,
    )
  }
  if (importPath === undefined) {
    mockStoryComponent(name, component)
  } else {
    registerFileComponentMock(importPath, generation, name, component)
  }
}
