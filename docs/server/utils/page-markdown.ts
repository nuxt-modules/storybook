import { queryCollection } from '@nuxt/content/server'
import { stringify } from 'minimark/stringify'

/** Markdown of a docs page, with its title and description on top. */
export async function pageMarkdown(
  event: Parameters<typeof queryCollection>[0],
  path: string,
): Promise<string | undefined> {
  const page = await queryCollection(event, docsVersionOf(path).collection)
    .path(path)
    .first()
  if (!page) {
    return undefined
  }

  if (page.body.value[0]?.[0] !== 'h1') {
    page.body.value.unshift(['blockquote', {}, page.description])
    page.body.value.unshift(['h1', {}, page.title])
  }

  stripTwoslashSetup(page.body)

  return stringify(
    { ...page.body, type: 'minimark' },
    { format: 'markdown/html' },
  )
}
