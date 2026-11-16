import type { queryCollection } from '@nuxt/content/server'

export type MigrationSource = 'v9' | 'v10'

const MIGRATION_PAGES: Record<MigrationSource, string> = {
  v9: '/11.x/migration/v10',
  v10: '/11.x/migration/v11',
}

/** Migration guide that upgrades a project from the given version. */
export function migrationGuide(
  event: Parameters<typeof queryCollection>[0],
  from: MigrationSource,
): Promise<string | undefined> {
  return pageMarkdown(event, MIGRATION_PAGES[from])
}
