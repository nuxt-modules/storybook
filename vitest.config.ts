import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineVitestProject({
  test: {
    typecheck: {
      enabled: true,
      // Don't fail the test if typecheck of source files fails for the moment
      ignoreSourceErrors: true,
    },
    include: ['test/*.spec.ts'],
  },
})
