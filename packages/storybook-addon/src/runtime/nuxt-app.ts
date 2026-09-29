import { addRouteMiddleware, applyPlugins, createNuxtApp } from 'nuxt/app'
import { $fetch } from 'ofetch'
import { getContext } from 'unctx'
import { reactive, shallowReactive } from 'vue'
import type { NuxtApp } from 'nuxt/app'
import type { App, InjectionKey } from 'vue'
import { runtimeConfig } from 'virtual:nuxt-storybook/options'
import plugins from '#build/plugins'
import '#build/css'
import { blockRouterNavigation } from './navigation'
import type { NuxtParameters } from '../types'

type CreateOptions = Parameters<typeof createNuxtApp>[0]

type Payload = NuxtApp['payload']

export interface StoryApp {
  appId: string
  canvasElement: HTMLElement
  parameters: NuxtParameters
}

export const STORY_APP = Symbol(
  'nuxt-storybook:story-app',
) as InjectionKey<StoryApp>

const DEFAULT_APP_ID = 'nuxt-app'

const DEFAULT_RUNTIME_CONFIG = { app: { baseURL: '/' }, public: {} }


export function createStoryNuxtApp(
  vueApp: App,
  canvasElement: HTMLElement,
  parameters: NuxtParameters,
): Promise<NuxtApp> {
  const story: StoryApp = {
    appId: `nuxt-app-${canvasElement.id}`,
    canvasElement,
    parameters,
  }
  const booted = bootstrapping.then(() => bootstrapNuxtApp(vueApp, story))
  bootstrapping = booted.catch(() => undefined)
  return booted
}


export function disposeStoryNuxtApp(nuxt: NuxtApp): void {
  for (const id of [nuxt._id, DEFAULT_APP_ID]) {
    const context = getContext<NuxtApp>(id)
    // Stories rendered in the same canvas share an id: a newer one may own it
    if (context.tryUse() === nuxt) {
      context.unset()
    }
  }
}

let bootstrapping: Promise<unknown> = Promise.resolve()

async function bootstrapNuxtApp(
  vueApp: App,
  story: StoryApp,
): Promise<NuxtApp> {
  const { appId, parameters } = story

  globalThis.$fetch ??= $fetch.create({
    baseURL: '/',
  }) as typeof globalThis.$fetch

  const nuxt = createNuxtApp({
    id: appId,
    payload: createStoryPayload(parameters),
    vueApp,
  } as CreateOptions)
  claimDefaultContext(nuxt)

  vueApp.provide(STORY_APP, story)
  reportErrorsToNuxt(vueApp, nuxt)

  await nuxt.runWithContext(() => applyPlugins(nuxt, plugins))

  // @ts-expect-error $router is injected by the router plugin
  nuxt.$router.afterEach(() => nuxt._route.sync?.())
  await nuxt.hooks.callHook('app:created', nuxt.vueApp)

  if (!parameters.navigation) {
    await nuxt.runWithContext(() =>
      addRouteMiddleware('storybook-navigation', blockRouterNavigation, {
        global: true,
      }),
    )
  }
  await nuxt.hooks.callHook('app:beforeMount', nuxt.vueApp)

  return nuxt
}

function createStoryPayload(parameters: NuxtParameters): Payload {
  const path = parameters.route || '/'
  const payload: Payload = {
    _errors: shallowReactive<Payload['_errors']>({}),
    config: {
      ...DEFAULT_RUNTIME_CONFIG,
      ...runtimeConfig,
      ...parameters.runtimeConfig,
    },
    data: shallowReactive<Payload['data']>({}),
    once: new Set<string>(),
    path: path.includes('?') ? path : `${path}?`,
    serverRendered: false,
    state: reactive<Payload['state']>({}),
  }
  return shallowReactive(payload)
}

function claimDefaultContext(nuxt: NuxtApp) {
  const { runWithContext } = nuxt
  nuxt.runWithContext = (fn) => {
    getContext(DEFAULT_APP_ID).set(nuxt, true)
    return runWithContext(fn)
  }
}

function reportErrorsToNuxt(vueApp: App, nuxt: NuxtApp) {
  const showException = vueApp.config.errorHandler
  vueApp.config.errorHandler = (error, instance, info) => {
    void Promise.resolve(nuxt.hooks.callHook('app:error', error)).catch(
      (hookError: unknown) =>
        console.error('[nuxt] Error in `app:error` hook', hookError),
    )
    showException?.(error, instance, info)
  }
}
