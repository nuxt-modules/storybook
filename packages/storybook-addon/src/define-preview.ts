import { definePreview as definePreviewVue } from '@storybook/vue3-vite'
import type { VueTypes } from '@storybook/vue3-vite'
import { definePreviewAddon } from 'storybook/internal/csf'
import type { InferTypes, PreviewAddonEntry } from 'storybook/internal/csf'
import type { ProjectAnnotations } from 'storybook/internal/types'
import * as nuxtAnnotations from './preview'
import type { NuxtParameters } from './types'

export interface NuxtTypes {
  parameters: { nuxt?: NuxtParameters }
}

/** The user's addons, after the Nuxt one. */
type NuxtAddons<Addons extends PreviewAddonEntry[]> = (
  | typeof nuxtPreview
  | Addons[number]
)[]

/**
 * Creates a CSF Factories preview that boots each story inside a Nuxt app.
 * Nuxt's preview annotations run before the user's addons, as `@storybook/nextjs-vite` does.
 */
export function definePreview<Addons extends PreviewAddonEntry[] = []>(
  input: { addons?: Addons } & ProjectAnnotations<
    VueTypes & InferTypes<NuxtAddons<Addons>>
  >,
) {
  const addons: NuxtAddons<Addons> = [nuxtPreview, ...(input.addons ?? [])]

  return definePreviewVue({ ...input, addons })
}

const nuxtPreview = definePreviewAddon<NuxtTypes>(nuxtAnnotations)
