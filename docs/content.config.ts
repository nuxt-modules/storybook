import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      schema: z.object({
        links: z
          .array(
            z.object({
              icon: z.string(),
              label: z.string(),
              target: z.string().optional(),
              to: z.string(),
            }),
          )
          .optional(),
      }),
      source: {
        exclude: ['index.md'],
        include: '**',
      },
      type: 'page',
    }),
    landing: defineCollection({
      source: 'index.md',
      type: 'page',
    }),
  },
})
