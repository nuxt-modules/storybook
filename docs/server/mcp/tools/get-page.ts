import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  cache: '1h',
  description: `Retrieves the full content and details of a specific documentation page.

WHEN TO USE: Use this tool when you know the EXACT path to a documentation page. Common use cases:
- User asks for a specific page: "Show me the getting started guide" → /getting-started
- User asks about a known topic with a dedicated page
- You found a relevant path from list-pages and want the full content
- User references a specific section or guide they want to read

WHEN NOT TO USE: If you don't know the exact path and need to search/explore, use list-pages first.

WORKFLOW: This tool returns the complete page content including title, description, and full markdown. Use this when you need to provide detailed answers or code examples from specific documentation pages.`,
  handler: async ({ path }) => {
    const event = useEvent()
    const url = getRequestURL(event)
    const siteUrl = import.meta.dev
      ? `${url.protocol}//${url.hostname}:${url.port}`
      : url.origin

    try {
      const page = await queryCollection(event, 'docs')
        .where('path', '=', path)
        .select('title', 'path', 'description')
        .first()

      if (!page) {
        return {
          content: [{ text: 'Page not found', type: 'text' }],
          isError: true,
        }
      }

      const content = await $fetch<string>(`/raw${path}.md`, {
        baseURL: siteUrl,
      })

      const result = {
        content,
        description: page.description,
        path: page.path,
        title: page.title,
        url: `${siteUrl}${page.path}`,
      }

      return {
        content: [{ text: JSON.stringify(result, null, 2), type: 'text' }],
      }
    } catch {
      return {
        content: [{ text: 'Failed to get page', type: 'text' }],
        isError: true,
      }
    }
  },
  inputSchema: {
    path: z
      .string()
      .describe(
        'The page path from list-pages or provided by the user (e.g., /getting-started/installation)',
      ),
  },
})
