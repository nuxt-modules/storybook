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
 * Mock a Nuxt component
 * @param name The name of the component to mock.
 * @param component The mock component, or a factory returning or importing it.
 */
export function mockComponent(
  name: MockableComponent | (string & Record<never, never>),
  component: ComponentMock,
): void
export function mockComponent(name: string, component: ComponentMock): void {
  assertMocked(name)
  mockStoryComponent(name, component)
}

export function mockFileComponent(
  importPath: string,
  // Incremented on each transform of the same file
  generation: number,
  name: string,
  component: ComponentMock,
): void {
  assertMocked(name)
  registerFileComponentMock(importPath, generation, name, component)
}

function assertMocked(name: string): void {
  if (!mockedComponents.includes(name)) {
    throw new Error(
      `mockComponent('${name}'): '${name}' is not a mocked Nuxt component. Check the name, and restart Storybook if the mock was added after it started.`,
    )
  }
}
