import type { NuxtApp } from 'nuxt/app'
import type { Component } from 'vue'
import { hookCanvas } from '../story/hook-context'
import { resolveStoryNuxtApp } from '../story/context'

// oxlint-disable-next-line typescript/no-explicit-any -- same as the Procedure of `storybook/test`
export type Procedure = (...args: any[]) => any

type ComponentModule = Component | { default: Component }

type ComponentFactory = () => ComponentModule | Promise<ComponentModule>

// Like `@nuxt/test-utils`, a function is a factory, even a functional component
export type ComponentMock = ComponentModule | ComponentFactory

export type ImportFactory<T extends Procedure = Procedure> = () =>
  | T
  | Promise<T>

/** Wraps the original of a built-in mocked import, when no factory mocks it. */
export type ImportGuard = (original: Procedure) => Procedure

// What the mocks of a story file resolve to: they run once, when it loads
interface ImportPathMocks {
  components: Map<string, Promise<Component>>
  imports: Map<string, Promise<Procedure>>
  /** The transform generation of the story module that registered them. */
  generation: number
}

interface StoryMocks {
  /** Whether the story's Nuxt app, which renders the components, took them. */
  applied: boolean
  components: Record<string, Component>
  guards: Record<string, ImportGuard>
  imports: Record<string, Procedure>
  /** The mocks a hook of the story registered, still resolving. */
  pending: Promise<void>[]
}

export function registerFileMock(
  importPath: string,
  generation: number,
  name: string,
  factory: ImportFactory,
): void {
  const { imports } = importPathMocksOf(importPath, generation)
  imports.set(name, settled(resolveImport(factory)))
}

export function registerFileComponentMock(
  importPath: string,
  generation: number,
  name: string,
  component: ComponentMock,
): void {
  const { components } = importPathMocksOf(importPath, generation)
  components.set(name, settled(resolveComponent(component)))
}

/** Gives a story the mocks of its file, before its hooks run. */
export async function beginStoryMocks(
  canvas: EventTarget,
  importPath: string,
  guards: Record<string, ImportGuard> = {},
): Promise<void> {
  const file = importPathMocks.get(importPath)
  canvasMocks.set(canvas, {
    applied: false,
    components: await resolveAll(file?.components),
    guards,
    imports: await resolveAll(file?.imports),
    pending: [],
  })
}

/** Mocks an auto-import for the story whose hook is running. */
export function mockStoryImport(name: string, factory: ImportFactory): void {
  const mocks = hookMocks(`mockNuxtImport('${name}')`)
  mocks.pending.push(
    resolveImport(factory).then((mock) => {
      mocks.imports[name] = mock
    }),
  )
}

/** Mocks a component for the story whose hook is running, before it renders. */
export function mockStoryComponent(
  name: string,
  component: ComponentMock,
): void {
  const call = `mockComponent('${name}')`
  const mocks = hookMocks(call)
  if (mocks.applied) {
    throw new Error(
      `[nuxt-storybook] ${call} was called after its story rendered. Call it in a beforeEach, or before mount() in play.`,
    )
  }
  mocks.pending.push(
    resolveComponent(component).then((resolved) => {
      mocks.components[name] = resolved
    }),
  )
}

/** Gives the Nuxt app of a story its mocks, once those of its hooks resolved. */
export async function applyStoryMocks(
  nuxt: NuxtApp,
  canvas: EventTarget,
): Promise<void> {
  const mocks = canvasMocks.get(canvas)
  if (!mocks) {
    return
  }
  await Promise.all(mocks.pending)
  mocks.applied = true
  appMocks.set(nuxt, mocks)
}

/**
 * Picks the implementation of an auto-import for the calling story: the one
 * of the hook calling it, else the one of the calling Nuxt app.
 */
export function resolveMock<T extends Procedure>(name: string, original: T): T {
  const canvas = hookCanvas()
  const nuxt = canvas ? undefined : resolveStoryNuxtApp(`${name}()`)
  const mocks = canvas ? canvasMocks.get(canvas) : nuxt && appMocks.get(nuxt)
  const mock = mocks?.imports[name] ?? mocks?.guards[name]?.(original)
  return (mock as T | undefined) ?? original
}

export function resolveMockedComponent(
  nuxt: NuxtApp,
  name: string,
): Component | undefined {
  return appMocks.get(nuxt)?.components[name]
}

const importPathMocks = new Map<string, ImportPathMocks>()

const canvasMocks = new WeakMap<EventTarget, StoryMocks>()

const appMocks = new WeakMap<NuxtApp, StoryMocks>()

function importPathMocksOf(
  importPath: string,
  generation: number,
): ImportPathMocks {
  let mocks = importPathMocks.get(importPath)
  // A new generation is a re-evaluated story module (HMR): it starts over
  if (mocks?.generation !== generation) {
    mocks = { components: new Map(), generation, imports: new Map() }
    importPathMocks.set(importPath, mocks)
  }
  return mocks
}

function hookMocks(call: string): StoryMocks {
  const canvas = hookCanvas()
  const mocks = canvas && canvasMocks.get(canvas)
  if (!mocks) {
    throw new Error(
      `[nuxt-storybook] The story of ${call} is unknown. Call it at the top level of a story file, or in a hook written in the story file (beforeEach, play, loaders), not in a helper after an await.`,
    )
  }
  return mocks
}

// Async, for a factory that throws to reject like one that returns a rejection
async function resolveImport(factory: ImportFactory): Promise<Procedure> {
  return factory()
}

// `() => import('../Mock.vue')` resolves to the module, not the component
async function resolveComponent(mock: ComponentMock): Promise<Component> {
  const result = isFactory(mock) ? await mock() : mock
  return 'default' in result ? result.default : result
}

function isFactory(mock: ComponentMock): mock is ComponentFactory {
  return typeof mock === 'function'
}

// A story of the file reports the rejection, when it awaits the mock
function settled<T>(mock: Promise<T>): Promise<T> {
  mock.catch(() => {})
  return mock
}

async function resolveAll<T>(
  mocks: Map<string, Promise<T>> = new Map(),
): Promise<Record<string, T>> {
  const entries = [...mocks].map(async ([name, mock]) => [name, await mock])
  return Object.fromEntries(await Promise.all(entries))
}
