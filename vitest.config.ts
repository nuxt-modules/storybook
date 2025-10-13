import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      await defineVitestProject({
        test: {
          typecheck: {
            enabled: true,
            // Don't fail the test if typecheck of source files fails for the moment
            ignoreSourceErrors: true,
          },
          name: 'nuxt',
          include: ['test/*.spec.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
