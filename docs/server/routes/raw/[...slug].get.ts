import { withLeadingSlash } from 'ufo'

export default eventHandler(async (event) => {
  const slug = getRouterParams(event).slug
  const markdown = slug?.endsWith('.md')
    ? await pageMarkdown(event, withLeadingSlash(slug.replace('.md', '')))
    : undefined
  if (markdown === undefined) {
    throw createError({
      fatal: true,
      statusCode: 404,
      statusMessage: 'Page not found',
    })
  }

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  return markdown
})
