import { tryUseNuxtApp } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'

// oxlint-disable-next-line typescript/no-explicit-any -- same as the Procedure of `storybook/test`
export type Procedure = (...args: any[]) => any

type Factory = () => Procedure

const fileMocks = new Map<string, Map<string, Factory>>()
const appMocks = new WeakMap<NuxtApp, Record<string, Procedure>>()

export function registerFileMock(
  file: string,
  name: string,
  factory: Factory,
): void {
  const factories = fileMocks.get(file) ?? new Map<string, Factory>()
  if (factories.has(name)) {
    throw new Error(
      `${name} is already mocked in ${file}. Each auto-import can only be mocked once per story file.`,
    )
  }
  factories.set(name, factory)
  fileMocks.set(file, factories)
}

/** Gives a story's Nuxt app the implementations of its file, freshly built. */
export function applyFileMocks(nuxt: NuxtApp, file: string | undefined): void {
  const factories = file === undefined ? undefined : fileMocks.get(file)
  if (factories) {
    const mocks = [...factories].map(([name, factory]) => [name, factory()])
    appMocks.set(nuxt, Object.fromEntries(mocks))
  }
}

export function resolveMock<T extends Procedure>(name: string, original: T): T {
  const nuxt = tryUseNuxtApp()
  const mock = nuxt ? appMocks.get(nuxt)?.[name] : undefined
  return (mock as T | undefined) ?? original
}
