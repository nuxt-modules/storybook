import type { ObjectPlugin } from 'nuxt/app'
import { storybookPlugins } from '../packages/storybook-addon/src/runtime/app/plugins'

describe(storybookPlugins, () => {
  it.each<{ name: string; input: ObjectPlugin; expected: boolean }>([
    { name: 'no env', input: {}, expected: true },
    {
      name: 'islands: false',
      input: { env: { islands: false } },
      expected: true,
    },
    {
      name: 'storybook: true',
      input: { env: { storybook: true } },
      expected: true,
    },
    {
      name: 'storybook: false',
      input: { env: { storybook: false } },
      expected: false,
    },
  ])('$name → kept: $expected', ({ input, expected }) => {
    // What `defineNuxtPlugin()` builds from an object plugin
    const plugin = Object.assign(() => {}, input)
    expect(storybookPlugins([plugin])).toHaveLength(expected ? 1 : 0)
  })
})
