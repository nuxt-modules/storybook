import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  generateMarkDown,
  getGitDiff,
  loadChangelogConfig,
  parseCommits,
} from 'changelogen'
import { valid } from 'semver'

const CHANGELOG_FILE = 'CHANGELOG.md'
const PACKAGES_DIR = 'packages'


async function prepareRelease() {
  const version = valid(process.argv[2])
  if (!version) {
    throw new Error(`Invalid version: "${process.argv[2]}"`)
  }

  writeChangelog(version, await generateChangelog(version))
  syncVersions(version)
}

async function generateChangelog(version: string): Promise<string> {
  const config = await loadChangelogConfig(process.cwd(), {
    newVersion: version,
  })
  const rawCommits = await getGitDiff(config.from, config.to)
  const commits = parseCommits(rawCommits, config).filter(
    (commit) =>
      config.types[commit.type] &&
      commit.scope !== 'release' &&
      !(
        commit.type === 'chore' &&
        commit.scope === 'deps' &&
        !commit.isBreaking
      ),
  )

  return (await generateMarkDown(commits, config)).trim()
}

function writeChangelog(version: string, section: string) {
  let changelog = readFileSync(CHANGELOG_FILE, 'utf8')

  const heading = `## v${version}\n`
  const start = changelog.indexOf(heading)
  if (start !== -1) {
    const end = changelog.indexOf('\n## ', start)
    changelog =
      changelog.slice(0, start) + (end === -1 ? '' : changelog.slice(end + 1))
  }

  const firstRelease = changelog.search(/^## /m)
  const insertAt = firstRelease === -1 ? changelog.length : firstRelease
  writeFileSync(
    CHANGELOG_FILE,
    `${changelog.slice(0, insertAt)}${section}\n\n${changelog.slice(insertAt)}`,
  )
}

function syncVersions(version: string) {
  const packageFiles = readdirSync(PACKAGES_DIR)
    .map((name) => join(PACKAGES_DIR, name, 'package.json'))
    .filter((file) => existsSync(file))

  for (const file of ['package.json', ...packageFiles]) {
    // Replace in place rather than re-serializing, to keep the file's formatting
    const content = readFileSync(file, 'utf8')
    writeFileSync(
      file,
      content.replace(/"version":\s*"[^"]*"/, `"version": "${version}"`),
    )
  }
}

await prepareRelease()
