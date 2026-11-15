import type { queryCollection } from '@nuxt/content/server'

export type MigrationSource = 'v9' | 'v10'

const MIGRATION_PAGE = '/11.x/getting-started/migration'

/** Section of the migration guide that upgrades a project from the given version. */
export async function migrationGuide(
  event: Parameters<typeof queryCollection>[0],
  from: MigrationSource,
): Promise<string | undefined> {
  const markdown = await pageMarkdown(event, MIGRATION_PAGE)

  const start = markdown?.search(new RegExp(`^## From ${from} to `, 'm'))
  if (markdown === undefined || start === undefined || start === -1) {
    return undefined
  }
  const end = markdown.slice(start + 1).search(/^## /m)
  return markdown.slice(start, end === -1 ? undefined : start + 1 + end).trim()
}
