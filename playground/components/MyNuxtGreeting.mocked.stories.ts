import { mockNuxtImport } from '@storybook-vue/nuxt'
import { expect, within } from 'storybook/test'

import preview from '../.storybook/preview'
import MyNuxtGreeting from './MyNuxtGreeting.vue'

// `useGreeting` is the default export of its composable file
const useGreeting = mockNuxtImport(
  'useGreeting',
  () => (name: string) => `Bonjour ${name}`,
)

const meta = preview.meta({
  args: { name: 'Nuxt' },
  component: MyNuxtGreeting,
  tags: ['autodocs'],
  title: 'Nuxt/Greeting Mocked',
})

export const Mocked = meta.story({
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText('Bonjour Nuxt')).toBeVisible()
    await expect(useGreeting).toHaveBeenCalledWith('Nuxt')
  },
})

let greetingInHook = ''

// The mocks are in place before the hooks of the story run
export const CalledInHook = meta.story({
  beforeEach() {
    greetingInHook = useGreeting('hook')
  },
  async play() {
    await expect(greetingInHook).toBe('Bonjour hook')
  },
})

// A story hook mocks the import for its story only
export const MockedInHook = meta.story({
  beforeEach() {
    mockNuxtImport('useGreeting', () => (name: string) => `Hallo ${name}`)
  },
  async play({ canvasElement }) {
    await expect(within(canvasElement).getByText('Hallo Nuxt')).toBeVisible()
  },
})
