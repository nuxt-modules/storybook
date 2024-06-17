/**
 * Usage: pnpm jiti prepare-release.ts
 *
 * This script will:
 * 1. Check if the git repo is clean and up-to-date with the remote
 * 2. Determine the new version based on the commits since the last tag
 * 3. Update the version in all packages
 * 4. Generate a changelog based on the commits and write it to CHANGELOG.md
 * 5. Create a new branch with the new version as the name and commit the changes
 *
 * This is mostly meant as workaround for the lack of monorepo support in changelogen
 * https://github.com/unjs/changelogen/issues/85
 *
 * It is mostly based on https://github.com/nuxt/nuxt/blob/main/scripts/update-changelog.ts
 */

import { inc } from 'semver'
import { consola } from 'consola'
import { existsSync, promises as fsp } from 'node:fs'
import { resolve } from 'pathe'
import { globby } from 'globby'
import { execaSync } from 'execa'
import {
  determineSemverChange,
  getGitDiff,
  loadChangelogConfig,
  generateMarkDown,
  parseCommits,
} from 'changelogen'
import { execSync } from 'node:child_process'

export interface Dep {
  name: string
  range: string
  type: string
}
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type Package = ThenArg<ReturnType<typeof loadPackage>>
export async function loadPackage(dir: string) {
  const pkgPath = resolve(dir, 'package.json')
  const data = JSON.parse(
    await fsp.readFile(pkgPath, 'utf-8').catch(() => '{}'),
  )
  const save = () =>
    fsp.writeFile(pkgPath, JSON.stringify(data, null, 2) + '\n')

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const updateDeps = (reviver: (dep: Dep) => Dep | void) => {
    for (const type of [
      'dependencies',
      'devDependencies',
      'optionalDependencies',
      'peerDependencies',
    ]) {
      if (!data[type]) {
        continue
      }
      for (const e of Object.entries(data[type])) {
        const dep: Dep = { name: e[0], range: e[1] as string, type }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete data[type][dep.name]
        const updated = reviver(dep) || dep
        data[updated.type] = data[updated.type] || {}
        data[updated.type][updated.name] = updated.range
      }
    }
  }

  return {
    dir,
    data,
    save,
    updateDeps,
  }
}

export async function loadWorkspace(dir: string) {
  const workspacePkg = await loadPackage(dir)
  const pkgDirs = (
    await globby(['packages/*'], { onlyDirectories: true })
  ).sort()

  const packages: Package[] = []

  for (const pkgDir of pkgDirs) {
    const pkg = await loadPackage(pkgDir)
    if (!pkg.data.name) {
      continue
    }
    packages.push(pkg)
  }

  const find = (name: string) => {
    const pkg = packages.find((pkg) => pkg.data.name === name)
    if (!pkg) {
      throw new Error('Workspace package not found: ' + name)
    }
    return pkg
  }

  const rename = (from: string, to: string) => {
    find(from).data._name = find(from).data.name
    find(from).data.name = to
    for (const pkg of packages) {
      pkg.updateDeps((dep) => {
        if (dep.name === from && !dep.range.startsWith('npm:')) {
          dep.range = 'npm:' + to + '@' + dep.range
        }
      })
    }
  }

  const setVersion = (
    name: string,
    newVersion: string,
    opts: { updateDeps?: boolean } = {},
  ) => {
    find(name).data.version = newVersion
    if (!opts.updateDeps) {
      return
    }

    for (const pkg of packages) {
      pkg.updateDeps((dep) => {
        if (dep.name === name) {
          dep.range = newVersion
        }
      })
    }
  }

  const save = () => Promise.all(packages.map((pkg) => pkg.save()))

  return {
    dir,
    workspacePkg,
    packages,
    save,
    find,
    rename,
    setVersion,
  }
}

export async function determineBumpType() {
  const config = await loadChangelogConfig(process.cwd())
  const commits = await getLatestCommits()

  const bumpType = determineSemverChange(commits, config)

  return bumpType === 'major' ? 'minor' : bumpType
}

export async function getLatestCommits() {
  const config = await loadChangelogConfig(process.cwd())
  const latestTag = execaSync('git', [
    'describe',
    '--tags',
    '--abbrev=0',
  ]).stdout

  return parseCommits(await getGitDiff(latestTag), config)
}

async function bumpVersion() {
  const workspace = await loadWorkspace(process.cwd())
  const config = await loadChangelogConfig(process.cwd(), {})

  const commits = await getLatestCommits().then((commits) =>
    commits.filter(
      (c) =>
        config.types[c.type] &&
        !(c.type === 'chore' && c.scope === 'deps' && !c.isBreaking),
    ),
  )
  const bumpType = (await determineBumpType()) || 'patch'

  const newVersion = inc(
    workspace.find('@nuxtjs/storybook').data.version,
    bumpType,
  )
  if (!newVersion) {
    throw new Error('Failed to determine new version')
  }
  for (const pkg of workspace.packages.filter((p) => !p.data.private)) {
    workspace.setVersion(pkg.data.name, newVersion!)
  }
  await workspace.save()
  return { commits, newVersion }
}

async function writeChangelog(changelog: string) {
  const output = resolve(process.cwd(), 'CHANGELOG.md')
  let changelogMD: string
  if (existsSync(output)) {
    changelogMD = await fsp.readFile(output, 'utf8')
  } else {
    changelogMD = '# Changelog\n\n'
  }

  const lastEntry = changelogMD.match(/^###?\s+(?:\S.*)?$/m)

  if (lastEntry) {
    changelogMD =
      changelogMD.slice(0, lastEntry.index) +
      changelog +
      '\n\n' +
      changelogMD.slice(lastEntry.index)
  } else {
    changelogMD += '\n' + changelog + '\n\n'
  }

  await fsp.writeFile(output, changelogMD)
}

function checkGitBranch() {
  const isDirtyGit = !!execSync('git status --porcelain')
  if (isDirtyGit) {
    consola.error(`Git repo isn't clean.`)
    process.exit(1)
  }

  // Check current branch
  const currentBranch = execSync('git branch --show-current').toString().trim()
  if (currentBranch !== 'main') {
    consola.error(
      `You should be on branch "main" but are on "${currentBranch}"`,
    )
    process.exit(1)
  }

  // Check if branch is outdated with remote
  const isOutdatedRE = /\Wmain\W.*can be fast-forwarded/i
  const isOutdatedGit = isOutdatedRE.test(
    execSync('git remote update && git status -uno').toString(),
  )
  if (isOutdatedGit) {
    consola.error(`Git branch is not in sync with remote`)
    process.exit(1)
  }
}

async function main() {
  checkGitBranch()
  const { commits, newVersion } = await bumpVersion()
  const changelog = await generateMarkDown(
    commits,
    await loadChangelogConfig(process.cwd(), { newVersion }),
  )
  await writeChangelog(changelog)
  execSync('pnpm lint:prettier --write')

  execSync(`git checkout -b v${newVersion}`)
  execSync(`git commit -am "chore(release): bump version to ${newVersion}"`)
}

main().catch((err) => {
  consola.error(err)
  process.exit(1)
})
