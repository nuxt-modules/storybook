import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const docsSchema = z.object({
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
})

export default defineContentConfig({
  collections: {
    // The stable docs, fetched from the `10.x` branch at build time
    docsV10: defineCollection({
      schema: docsSchema,
      source: {
        exclude: ['docs/content/index.md'],
        include: 'docs/content/**',
        prefix: '/',
        repository: {
          branch: '10.x',
          url: 'https://github.com/nuxt-modules/storybook',
        },
      },
      type: 'page',
    }),
    // The docs of the next version, from this branch
    docsV11: defineCollection({
      schema: docsSchema,
      source: {
        exclude: ['index.md'],
        include: '**',
        prefix: '/11.x',
      },
      type: 'page',
    }),
    landing: defineCollection({
      source: 'index.md',
      type: 'page',
    }),
  },
})
