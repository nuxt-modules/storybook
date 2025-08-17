import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environmentOptions: {
      nuxt: {
        overrides: {
          modules: ['@nuxtjs/storybook'],
        },
      },
    },
    coverage: {
      reporter: ['text', 'json'],
      include: ['src'],
    },
    typecheck: {
      enabled: true,
      // Don't fail the test if typecheck of source files fails for the moment
      ignoreSourceErrors: true,
    },
    include: ['test/*.spec.ts'],
  },
})
