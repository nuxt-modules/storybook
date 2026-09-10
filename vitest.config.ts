import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/*.spec.ts'],
    typecheck: {
      enabled: true,
      // Don't fail the test if typecheck of source files fails for the moment
      ignoreSourceErrors: true,
    },
  },
})
