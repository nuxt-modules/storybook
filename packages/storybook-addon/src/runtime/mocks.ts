import { tryUseNuxtApp } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'
import type { Component } from 'vue'

// oxlint-disable-next-line typescript/no-explicit-any -- same as the Procedure of `storybook/test`
export type Procedure = (...args: any[]) => any

export type ComponentFactory = () =>
  | Component
  | { default: Component }
  | Promise<Component | { default: Component }>

type Factory = () => Procedure

interface ImportPathMocks {
  components: Map<string, ComponentFactory>
  factories: Map<string, Factory>
  /** The transform generation of the story module that registered them. */
  generation: number
}

interface AppMocks {
  components: Record<string, Component>
  imports: Record<string, Procedure>
}

export function registerFileMock(
  importPath: string,
  generation: number,
  name: string,
  factory: Factory,
): void {
  importPathMocksOf(importPath, generation).factories.set(name, factory)
}

export function registerFileComponentMock(
  importPath: string,
  generation: number,
  name: string,
  factory: ComponentFactory,
): void {
  importPathMocksOf(importPath, generation).components.set(name, factory)
}

export async function applyFileMocks(
  nuxt: NuxtApp,
  importPath: string,
): Promise<void> {
  const mocks = importPathMocks.get(importPath)
  if (!mocks) {
    return
  }
  const imports = [...mocks.factories].map(([name, factory]) => [
    name,
    factory(),
  ])
  const components = await Promise.all(
    [...mocks.components].map(async ([name, factory]) => [
      name,
      unwrapModule(await factory()),
    ]),
  )
  appMocks.set(nuxt, {
    components: Object.fromEntries(components),
    imports: Object.fromEntries(imports),
  })
}

/** Picks the implementation of an auto-import for the calling story's app. */
export function resolveMock<T extends Procedure>(name: string, original: T): T {
  const nuxt = tryUseNuxtApp()
  const mock = nuxt ? appMocks.get(nuxt)?.imports[name] : undefined
  return (mock as T | undefined) ?? original
}

export function resolveMockedComponent(
  nuxt: NuxtApp,
  name: string,
): Component | undefined {
  return appMocks.get(nuxt)?.components[name]
}

const importPathMocks = new Map<string, ImportPathMocks>()

const appMocks = new WeakMap<NuxtApp, AppMocks>()

function importPathMocksOf(
  importPath: string,
  generation: number,
): ImportPathMocks {
  let mocks = importPathMocks.get(importPath)
  // A new generation is a re-evaluated story module (HMR): it starts over
  if (mocks?.generation !== generation) {
    mocks = { components: new Map(), factories: new Map(), generation }
    importPathMocks.set(importPath, mocks)
  }
  return mocks
}

// `() => import('./Mock.vue')` resolves to the module, not the component
function unwrapModule(result: Component | { default: Component }): Component {
  return 'default' in result ? result.default : result
}
