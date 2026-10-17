import { tryUseNuxtApp } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'

// oxlint-disable-next-line typescript/no-explicit-any -- same as the Procedure of `storybook/test`
export type Procedure = (...args: any[]) => any

type Factory = () => Procedure

interface FileMocks {
  factories: Map<string, Factory>
  /** The transform generation of the story module that registered them. */
  generation: number
}

export function registerFileMock(
  file: string,
  generation: number,
  name: string,
  factory: Factory,
): void {
  let mocks = fileMocks.get(file)
  // A new generation is a re-evaluated story module (HMR): it starts over
  if (mocks?.generation !== generation) {
    mocks = { factories: new Map(), generation }
    fileMocks.set(file, mocks)
  }
  mocks.factories.set(name, factory)
}

export function applyFileMocks(nuxt: NuxtApp, file: string): void {
  const factories = fileMocks.get(file)?.factories
  if (factories) {
    const mocks = [...factories].map(([name, factory]) => [name, factory()])
    appMocks.set(nuxt, Object.fromEntries(mocks))
  }
}

/** Picks the implementation of an auto-import for the calling story's app. */
export function resolveMock<T extends Procedure>(name: string, original: T): T {
  const nuxt = tryUseNuxtApp()
  const mock = nuxt ? appMocks.get(nuxt)?.[name] : undefined
  return (mock as T | undefined) ?? original
}

const fileMocks = new Map<string, FileMocks>()

const appMocks = new WeakMap<NuxtApp, Record<string, Procedure>>()
