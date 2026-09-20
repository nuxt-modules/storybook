declare module '@storybook/vue3-vite/preset' {
  import type { StorybookConfig } from '@storybook/vue3-vite'

  export const core: NonNullable<StorybookConfig['core']>
  export const viteFinal: NonNullable<StorybookConfig['viteFinal']>
}
