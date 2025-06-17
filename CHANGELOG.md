# Changelog

## v8.4.0

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.3.5...v8.4.0)

### 🚀 Enhancements

- ⚠️  Upgrade storybook to v9 ([#882](https://github.com/nuxt-modules/storybook/pull/882))

### 🏡 Chore

- Widen peer dependency constraints for renovate ([#902](https://github.com/nuxt-modules/storybook/pull/902))
- Re-enable nightly release ([#903](https://github.com/nuxt-modules/storybook/pull/903))

#### ⚠️ Breaking Changes

- ⚠️  Upgrade storybook to v9 ([#882](https://github.com/nuxt-modules/storybook/pull/882))

### ❤️ Contributors

- Tobias Diez <code@tobiasdiez.de>

## v8.3.5

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.3.4...v8.3.5)

## v8.3.4

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.3.3...v8.3.4)

### 🩹 Fixes

- Change server proxy preset for @nuxt/icon ([#836](https://github.com/nuxt-modules/storybook/pull/836))
- Enable cycles option when stringifying objects ([#894](https://github.com/nuxt-modules/storybook/pull/894))

### 📖 Documentation

- Update installation instructions to use new Storybook CLI ([#659](https://github.com/nuxt-modules/storybook/pull/659))
- Update logo and add gradient to landing page ([#837](https://github.com/nuxt-modules/storybook/pull/837))
- Replace url property with host ([#875](https://github.com/nuxt-modules/storybook/pull/875))

### 🏡 Chore

- Fail workflow if chromatic finds changes in examples ([#843](https://github.com/nuxt-modules/storybook/pull/843))
- Fix starter examples ([#845](https://github.com/nuxt-modules/storybook/pull/845))
- Merge renovate PRs automatically ([#844](https://github.com/nuxt-modules/storybook/pull/844))
- Update starter ([#846](https://github.com/nuxt-modules/storybook/pull/846))
- Upgrade json-stable-stringify and remove obsolete `@types` package ([#879](https://github.com/nuxt-modules/storybook/pull/879))
- Update tested Node versions in ci ([#881](https://github.com/nuxt-modules/storybook/pull/881))
- Use locked version of storybook to create starter ([#847](https://github.com/nuxt-modules/storybook/pull/847))

### ❤️ Contributors

- Eugen Istoc <eugenistoc@gmail.com>
- Tobias Diez <code@tobiasdiez.de>
- Sawden ([@sawden](https://github.com/sawden))
- Casper Tollefsen ([@CasperSocio](https://github.com/CasperSocio))

## v8.3.3

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.3.2...v8.3.3)

### 🩹 Fixes

- Use storybook vitest config as base ([#740](https://github.com/nuxt-modules/storybook/pull/740))
- Readd vue-tempate-compilation plugin ([#831](https://github.com/nuxt-modules/storybook/pull/831))
- Nuxt App created only when story vue app rendered first time, ([#830](https://github.com/nuxt-modules/storybook/pull/830))

### 🏡 Chore

- Add test for using decorators in stories ([#823](https://github.com/nuxt-modules/storybook/pull/823))

### ❤️ Contributors

- Chakir QATAB ([@chakAs3](http://github.com/chakAs3))
- Tobias Diez <code@tobiasdiez.de>
- Ryan Leckey ([@mehcode](http://github.com/mehcode))

## v8.3.2

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.3.1...v8.3.2)

### 📖 Documentation

- Module will not automatically generate a basic configuration ([#797](https://github.com/nuxt-modules/storybook/pull/797))

### 🏡 Chore

- **ci:** Update CI workflow to use nightly-release change the script name ([#806](https://github.com/nuxt-modules/storybook/pull/806))

### ❤️ Contributors

- Chakir QATAB ([@chakAs3](http://github.com/chakAs3))
- Luca-smartpricing ([@luca-smartpricing](http://github.com/luca-smartpricing))

## v8.3.1

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.3.0...v8.3.1)

## v8.3.0

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.2.0...v8.3.0)

### 🚀 Enhancements

- Exposing the https options for Storybook dev server ([#772](https://github.com/nuxt-modules/storybook/pull/772))

### 🩹 Fixes

- ⚠️ Properly handle context when using multiple nuxt instances ([#762](https://github.com/nuxt-modules/storybook/pull/762))
- Remove Storybook version from `storybook.ts` ([#778](https://github.com/nuxt-modules/storybook/pull/778))
- Suppress fetch type warning ([#787](https://github.com/nuxt-modules/storybook/pull/787))

### 🏡 Chore

- Remove unused jsdom dev dependency ([#766](https://github.com/nuxt-modules/storybook/pull/766))
- Add github bug report template ([#769](https://github.com/nuxt-modules/storybook/pull/769))
- Add GitHub funding information ([#770](https://github.com/nuxt-modules/storybook/pull/770))
- Add playwright tests ([#783](https://github.com/nuxt-modules/storybook/pull/783))
- Pin @storybook/\* packages ([#785](https://github.com/nuxt-modules/storybook/pull/785))

#### ⚠️ Breaking Changes

- ⚠️ Properly handle context when using multiple nuxt instances ([#762](https://github.com/nuxt-modules/storybook/pull/762))

### ❤️ Contributors

- Daniel Roe ([@danielroe](http://github.com/danielroe))
- Tobias Diez <code@tobiasdiez.de>
- Olga Bulat ([@obulat](http://github.com/obulat))
- Brandon ([@brandondv](http://github.com/brandondv))

## v8.2.0

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.1.5...v8.2.0)

### 🚀 Enhancements

- Export types also from `@nuxtjs/storybook` ([#749](https://github.com/nuxt-modules/storybook/pull/749))

### 🩹 Fixes

- Update Vite configs to include lodash/kebabCase in optimizeDeps ([#715](https://github.com/nuxt-modules/storybook/pull/715))
- Fix error due to import json attribute (and deactivate storybook version check) ([#722](https://github.com/nuxt-modules/storybook/pull/722))
- Resolve module not found error '@storybook/builder-vite' ([#724](https://github.com/nuxt-modules/storybook/pull/724))
- Correctly load the storybook preview annotation ([#726](https://github.com/nuxt-modules/storybook/pull/726))
- Remove Nuxt context conflict ([#723](https://github.com/nuxt-modules/storybook/pull/723))
- Update storybook version to 8.2.7 ([#739](https://github.com/nuxt-modules/storybook/pull/739))

### 📖 Documentation

- Add instructions for opting in and out of nightly builds ([#748](https://github.com/nuxt-modules/storybook/pull/748))
- Nightly release dependency package name ([#750](https://github.com/nuxt-modules/storybook/pull/750))

### 🏡 Chore

- Fix build and chromatic ([#708](https://github.com/nuxt-modules/storybook/pull/708))
- Pin dependencies in examples ([#709](https://github.com/nuxt-modules/storybook/pull/709))
- Update renovate config to not ignore 'examples' directories ([#711](https://github.com/nuxt-modules/storybook/pull/711))
- Remove unused nightly release from CI ([#719](https://github.com/nuxt-modules/storybook/pull/719))
- Fix devtools in playground ([#727](https://github.com/nuxt-modules/storybook/pull/727))
- Add e2e tests ([#729](https://github.com/nuxt-modules/storybook/pull/729))
- Fix typescript error ([#734](https://github.com/nuxt-modules/storybook/pull/734))
- Try to fix nightly release ([#735](https://github.com/nuxt-modules/storybook/pull/735))
- Try to publish nightly versions for all packages ([#736](https://github.com/nuxt-modules/storybook/pull/736))
- **vscode:** Remove `eslint.experimental.useFlatConfig` ([#730](https://github.com/nuxt-modules/storybook/pull/730))
- Improve PR template ([#737](https://github.com/nuxt-modules/storybook/pull/737))
- Set compatibilityDate in nuxt.config.ts files ([#738](https://github.com/nuxt-modules/storybook/pull/738))
- Increase version before publishing nightly ([#745](https://github.com/nuxt-modules/storybook/pull/745))
- Update fetch-depth in CI workflow to fix nightly release ([#747](https://github.com/nuxt-modules/storybook/pull/747))
- Add chromatic as sponsor ([e8837c4](https://github.com/nuxt-modules/storybook/commit/e8837c4))

### ❤️ Contributors

- Tobias Diez <code@tobiasdiez.de>
- Hugo Torzuoli ([@HZooly](http://github.com/HZooly))
- Olga Bulat ([@obulat](http://github.com/obulat))
- Gangan ([@shinGangan](http://github.com/shinGangan))

## v8.1.5

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.1.4...v8.1.5)

### 🏡 Chore

- Fix prettier errors ([#701](https://github.com/nuxt-modules/storybook/pull/701))
- Build nuxt module before release ([#702](https://github.com/nuxt-modules/storybook/pull/702))

### ❤️ Contributors

- Tobias Diez <code@tobiasdiez.de>
- Olga Bulat ([@obulat](http://github.com/obulat))

## v8.1.4

[compare changes](https://github.com/nuxt-modules/storybook/compare/v0.2.10...v8.1.4)

### 🏡 Chore

- Fix linter and update lock file ([#686](https://github.com/nuxt-modules/storybook/pull/686))
- **release:** Bump version to 8.1.2 ([114c6db](https://github.com/nuxt-modules/storybook/commit/114c6db))
- Align dependency specifications across packages ([#693](https://github.com/nuxt-modules/storybook/pull/693))
- Tell renovate to pin all development and doc dependencies ([#692](https://github.com/nuxt-modules/storybook/pull/692))
- Mark a few more imports as external to fix build warnings ([#695](https://github.com/nuxt-modules/storybook/pull/695))
- Add tag creation in prepare-release script ([#697](https://github.com/nuxt-modules/storybook/pull/697))
- Fix linting warnings ([#687](https://github.com/nuxt-modules/storybook/pull/687))
- Only checkout the latest commit in CI ([#688](https://github.com/nuxt-modules/storybook/pull/688))

### ❤️ Contributors

- Olga Bulat ([@obulat](http://github.com/obulat))
- Tobias Diez <code@tobiasdiez.de>
- ChakAs3 ([@chakAs3](http://github.com/chakAs3))

## v8.1.3

[compare changes](https://github.com/nuxt-modules/storybook/compare/v0.2.10...v8.1.3)

### 🏡 Chore

- Fix linter and update lock file ([#686](https://github.com/nuxt-modules/storybook/pull/686))
- **release:** Bump version to 8.1.2 ([114c6db](https://github.com/nuxt-modules/storybook/commit/114c6db))
- Align dependency specifications across packages ([#693](https://github.com/nuxt-modules/storybook/pull/693))
- Tell renovate to pin all development and doc dependencies ([#692](https://github.com/nuxt-modules/storybook/pull/692))
- Mark a few more imports as external to fix build warnings ([#695](https://github.com/nuxt-modules/storybook/pull/695))
- Add tag creation in prepare-release script ([#697](https://github.com/nuxt-modules/storybook/pull/697))
- Fix linting warnings ([#687](https://github.com/nuxt-modules/storybook/pull/687))
- Only checkout the latest commit in CI ([#688](https://github.com/nuxt-modules/storybook/pull/688))

### ❤️ Contributors

- Olga Bulat ([@obulat](http://github.com/obulat))
- Tobias Diez <code@tobiasdiez.de>
- ChakAs3 ([@chakAs3](http://github.com/chakAs3))

## v8.1.2

[compare changes](https://github.com/nuxt-modules/storybook/compare/v0.2.10...v8.1.2)

### 🏡 Chore

- Fix linter and update lock file ([#686](https://github.com/nuxt-modules/storybook/pull/686))

### ❤️ Contributors

- Tobias Diez <code@tobiasdiez.de>

## v8.1.1

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.1.0...v8.1.1)

## v8.1.0

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.0.0...v8.1.0)

### 🚀 Enhancements

- Improve logging and hide verbose messages by default ([#554](https://github.com/nuxt-modules/storybook/pull/554))
- Improve build performance by no longer building the whole nuxt application for storybook ([#632](https://github.com/nuxt-modules/storybook/pull/632))
- Add enabled option ([#612](https://github.com/nuxt-modules/storybook/pull/612))

### 🩹 Fixes

- Build preset ([d2ac6cd](https://github.com/nuxt-modules/storybook/commit/d2ac6cd))
- Fix error "No builder configured in core." ([b4d833d](https://github.com/nuxt-modules/storybook/commit/b4d833d))
- Make sure the vue vite plugin is always present ([22e27fb](https://github.com/nuxt-modules/storybook/commit/22e27fb))
- Re-enable ssr ([7d849d1](https://github.com/nuxt-modules/storybook/commit/7d849d1))
- Change builddir ([b2e6dfd](https://github.com/nuxt-modules/storybook/commit/b2e6dfd))
- Fix TypeError when reading `__STORYBOOK__` property of undefined ([#539](https://github.com/nuxt-modules/storybook/pull/539))
- Relax version constraints of dependencies ([#438](https://github.com/nuxt-modules/storybook/pull/438))
- **deps:** Update dependency @storybook-vue/nuxt to v0.2.7 ([#544](https://github.com/nuxt-modules/storybook/pull/544))
- **deps:** Update lock file ([#551](https://github.com/nuxt-modules/storybook/pull/551))
- **deps:** Update dependency @nuxt/devtools-kit to v1.2.0 ([#546](https://github.com/nuxt-modules/storybook/pull/546))
- Properly handle the case when import.meta.env is undefined ([#566](https://github.com/nuxt-modules/storybook/pull/566))
- Remove unused dependencies ([#625](https://github.com/nuxt-modules/storybook/pull/625))
- Fix order of vite vue plugin ([#631](https://github.com/nuxt-modules/storybook/pull/631))
- Use appId and buildId as fallbacks, use `vite:configResolved` hook ([#633](https://github.com/nuxt-modules/storybook/pull/633))

### 📖 Documentation

- Replace tailwind by storybook in docs ([#579](https://github.com/nuxt-modules/storybook/pull/579))
- Clarify supported Storybook version ([#585](https://github.com/nuxt-modules/storybook/pull/585))
- Update examples ([#578](https://github.com/nuxt-modules/storybook/pull/578))
- **getting-started:** Fix url > host option ([#609](https://github.com/nuxt-modules/storybook/pull/609))

### 📦 Build

- Storybook-static,still have nuxt inst issue ([669e4be](https://github.com/nuxt-modules/storybook/commit/669e4be))

### 🏡 Chore

- **release:** V0.1.3 ([717b5b5](https://github.com/nuxt-modules/storybook/commit/717b5b5))
- **release:** V0.1.4 ([d4d8dfc](https://github.com/nuxt-modules/storybook/commit/d4d8dfc))
- **release:** V0.1.7 ([f92ba9e](https://github.com/nuxt-modules/storybook/commit/f92ba9e))
- **release:** V0.1.8 ([c3dc688](https://github.com/nuxt-modules/storybook/commit/c3dc688))
- **release:** V0.1.9 ([f77b61e](https://github.com/nuxt-modules/storybook/commit/f77b61e))
- **release:** V0.2.0 ([7ad02fc](https://github.com/nuxt-modules/storybook/commit/7ad02fc))
- **release:** V0.2.0 ([67aa07e](https://github.com/nuxt-modules/storybook/commit/67aa07e))
- **release:** V0.2.1 ([f9cffde](https://github.com/nuxt-modules/storybook/commit/f9cffde))
- Update all deps ([83a1634](https://github.com/nuxt-modules/storybook/commit/83a1634))
- **release:** V0.2.6 ([ac33a51](https://github.com/nuxt-modules/storybook/commit/ac33a51))
- Migrate to pnpm workspace to fix playground ([#536](https://github.com/nuxt-modules/storybook/pull/536))
- Fix publish workflow and add release of nighty builds ([#543](https://github.com/nuxt-modules/storybook/pull/543))
- Publish playground on chromatic ([#542](https://github.com/nuxt-modules/storybook/pull/542))
- Remove old scripts directory ([#535](https://github.com/nuxt-modules/storybook/pull/535))
- Add ESLint configuration ([#534](https://github.com/nuxt-modules/storybook/pull/534))
- Fix publishing of nightly releases ([#549](https://github.com/nuxt-modules/storybook/pull/549))
- Format code with Prettier ([#550](https://github.com/nuxt-modules/storybook/pull/550))
- Fix documentation ([#553](https://github.com/nuxt-modules/storybook/pull/553))
- Add netlify config ([#559](https://github.com/nuxt-modules/storybook/pull/559))
- Fix deployment path in netlify config ([#561](https://github.com/nuxt-modules/storybook/pull/561))
- Fix typo in netlify config ([#563](https://github.com/nuxt-modules/storybook/pull/563))
- Activate tests in ci ([#552](https://github.com/nuxt-modules/storybook/pull/552))
- Add starter example ([#564](https://github.com/nuxt-modules/storybook/pull/564))
- Add example for usage with tailwind ([#565](https://github.com/nuxt-modules/storybook/pull/565))
- Only publish examples once to chromatic ([#567](https://github.com/nuxt-modules/storybook/pull/567))
- Add example to showcase many features ([#575](https://github.com/nuxt-modules/storybook/pull/575))
- Use "latest" as dependency specifier in examples for stackblitz compatibility ([#577](https://github.com/nuxt-modules/storybook/pull/577))
- Fix linking of workspace packages ([#589](https://github.com/nuxt-modules/storybook/pull/589))
- Add `vite-plugin-inspect` in playground to make debugging easier ([#593](https://github.com/nuxt-modules/storybook/pull/593))
- Fix linter ([c62e6b7](https://github.com/nuxt-modules/storybook/commit/c62e6b7))
- Fix eslint issues ([35e79ed](https://github.com/nuxt-modules/storybook/commit/35e79ed))
- Merge storybook-nuxt repo ([a5827eb](https://github.com/nuxt-modules/storybook/commit/a5827eb))
- Move test for page with args to showcase example ([#620](https://github.com/nuxt-modules/storybook/pull/620))
- Include storybook-nuxt in workspace ([#611](https://github.com/nuxt-modules/storybook/pull/611))
- Update renovate.json configuration for minor and patch updates, weekend schedule, and commit message type ([#627](https://github.com/nuxt-modules/storybook/pull/627))

### ❤️ Contributors

- Julien Huang ([@huang-julien](http://github.com/huang-julien))
- Tobias Diez <code@tobiasdiez.de>
- Sam Blowes <samblowes@hotmail.com>
- Olga Bulat ([@obulat](http://github.com/obulat))
- Clément Ollivier ([@clemcode](http://github.com/clemcode))
- L.Rain ([@baixiaoyu2997](http://github.com/baixiaoyu2997))
- ChakAs3 ([@chakAs3](http://github.com/chakAs3))
- MiniDigger < Martin>

## v8.0.0

[compare changes](https://github.com/nuxt-modules/storybook/compare/v7.0.2...v8.0.0)

### 🩹 Fixes

- Add storybook as dependency ([#516](https://github.com/nuxt-modules/storybook/pull/516))
- Opt in to `import.meta.*` properties ([#512](https://github.com/nuxt-modules/storybook/pull/512))
- Remove disable ssr ([#511](https://github.com/nuxt-modules/storybook/pull/511))
- **deps:** Update nuxtjs monorepo to v3.11.2 ([#521](https://github.com/nuxt-modules/storybook/pull/521))
- ⚠️ Improve handling of module options ([#518](https://github.com/nuxt-modules/storybook/pull/518))
- **deps:** Update nuxtjs monorepo to v3.11.2 ([#523](https://github.com/nuxt-modules/storybook/pull/523))
- **deps:** Update dependency @nuxt/devtools-kit to v1.1.5 ([#506](https://github.com/nuxt-modules/storybook/pull/506))
- **deps:** Update dependency chalk to v5 ([#531](https://github.com/nuxt-modules/storybook/pull/531))

### 📖 Documentation

- Use new `nuxi module add` command in installation ([#514](https://github.com/nuxt-modules/storybook/pull/514))

### 🏡 Chore

- Fix Storybook version of comment ([#513](https://github.com/nuxt-modules/storybook/pull/513))
- Do not change nuxt devtools config ([#517](https://github.com/nuxt-modules/storybook/pull/517))
- Improve ci workflow ([#532](https://github.com/nuxt-modules/storybook/pull/532))

#### ⚠️ Breaking Changes

- ⚠️ Improve handling of module options ([#518](https://github.com/nuxt-modules/storybook/pull/518))

### ❤️ Contributors

- Tobias Diez <code@tobiasdiez.de>
- Julien Huang ([@huang-julien](http://github.com/huang-julien))
- Damian Głowala ([@DamianGlowala](http://github.com/DamianGlowala))
- Gangan ([@shinGangan](http://github.com/shinGangan))
- Daniel Roe ([@danielroe](http://github.com/danielroe))

## v7.0.2

[compare changes](https://github.com/nuxt-modules/storybook/compare/v7.0.1...v7.0.2)

## v7.0.1

[compare changes](https://github.com/nuxt-modules/storybook/compare/v7.0.0...v7.0.1)

### 📖 Documentation

- Playground tsconfig isse ([71e860d](https://github.com/nuxt-modules/storybook/commit/71e860d))

### 🏡 Chore

- Use module-builder stub mode for more accurate types ([#459](https://github.com/nuxt-modules/storybook/pull/459))

### ❤️ Contributors

- Daniel Roe ([@danielroe](http://github.com/danielroe))
- ChakAs3 ([@chakAs3](http://github.com/chakAs3))

## v7.0.0

[compare changes](https://github.com/nuxt-modules/storybook/compare/v7.0.0-alpha.0...v7.0.0)

## v0.2.10

[compare changes](https://github.com/nuxt-modules/storybook/compare/v0.2.9...v0.2.10)

### 🏡 Chore

- Fix release script ([#681](https://github.com/nuxt-modules/storybook/pull/681))
- **ci:** Add GitHub PR template ([#682](https://github.com/nuxt-modules/storybook/pull/682))
- Stay on main branch for releases ([#683](https://github.com/nuxt-modules/storybook/pull/683))
- Fix deployment of docs ([#685](https://github.com/nuxt-modules/storybook/pull/685))

### ❤️ Contributors

- Tobias Diez <code@tobiasdiez.de>
- Gangan ([@shinGangan](http://github.com/shinGangan))

## v0.2.9

[compare changes](https://github.com/nuxt-modules/storybook/compare/v0.2.8...v0.2.9)

### 🩹 Fixes

- Create nuxt instance more reliable ([#619](https://github.com/nuxt-modules/storybook/pull/619))
- Update file extensions for generated vite configs to use .json instead of .js ([#663](https://github.com/nuxt-modules/storybook/pull/663))
- Correctly provide Nuxt runtime config in storybook ([#664](https://github.com/nuxt-modules/storybook/pull/664))
- **deps:** Update storybook packages to ^8.1.11 ([#677](https://github.com/nuxt-modules/storybook/pull/677))

### 📖 Documentation

- Migrate to Nuxt UI Pro ([#668](https://github.com/nuxt-modules/storybook/pull/668))

### 🏡 Chore

- Add release script ([#655](https://github.com/nuxt-modules/storybook/pull/655))
- Move nuxt image test to showcase example ([#615](https://github.com/nuxt-modules/storybook/pull/615))
- Move router tests to showcase example ([#621](https://github.com/nuxt-modules/storybook/pull/621))
- Move nuxt link test to showcase example ([#618](https://github.com/nuxt-modules/storybook/pull/618))
- Move pinia tests to showcase example ([#616](https://github.com/nuxt-modules/storybook/pull/616))
- Remove old playground ([#622](https://github.com/nuxt-modules/storybook/pull/622))
- Update nuxt studio dependency to latest stable version ([#675](https://github.com/nuxt-modules/storybook/pull/675))
- Update renovate config to always bump storybook dependencies ([#676](https://github.com/nuxt-modules/storybook/pull/676))
- Disable shameful hoisting and improve dependency declarations ([#580](https://github.com/nuxt-modules/storybook/pull/580))

### ❤️ Contributors

- Tobias Diez <code@tobiasdiez.de>

## v0.2.8

[compare changes](https://github.com/nuxt-modules/storybook/compare/v8.1.1...v0.2.8)

### 🚀 Enhancements

- Start storybook in same process as dev server ([#592](https://github.com/nuxt-modules/storybook/pull/592))
- Declare module incompatibility for webpack ([#653](https://github.com/nuxt-modules/storybook/pull/653))

### 🩹 Fixes

- Update all non-major dependencies and fix "The entry point "vue" cannot be marked as external" error with nuxt 3.12 ([#634](https://github.com/nuxt-modules/storybook/pull/634))
- Extend storybook config types from vue3-vite framework ([#649](https://github.com/nuxt-modules/storybook/pull/649))

### 🏡 Chore

- Fix linter ([#644](https://github.com/nuxt-modules/storybook/pull/644))
- Move custom component test to showcase example ([#617](https://github.com/nuxt-modules/storybook/pull/617))
- Add shortcuts to start dev server for examples ([#646](https://github.com/nuxt-modules/storybook/pull/646))
- Indicate compatibility with new v4 major ([#645](https://github.com/nuxt-modules/storybook/pull/645))
- Move nuxt module to packages directory ([#654](https://github.com/nuxt-modules/storybook/pull/654))

### ❤️ Contributors

- Tobias Diez <code@tobiasdiez.de>
- Ryan Leckey ([@mehcode](http://github.com/mehcode))
- Daniel Roe ([@danielroe](http://github.com/danielroe))

## v0.2.6

[compare changes](https://github.com/storybook-vue/storybook-nuxt/compare/v0.2.6-alpha.0...v0.2.6)

## v0.2.1

[compare changes](https://github.com/storybook-vue/storybook-nuxt/compare/v0.2.1-alpha.1...v0.2.1)

## v0.2.0

[compare changes](https://github.com/storybook-vue/storybook-nuxt/compare/v0.2.1-alpha.0...v0.2.0)

## v0.2.0

[compare changes](https://github.com/storybook-vue/storybook-nuxt/compare/v0.2.0-alpha.4...v0.2.0)

## v0.1.9

[compare changes](https://github.com/storybook-vue/storybook-nuxt/compare/v0.1.9-alpha.0...v0.1.9)

## v0.1.8

[compare changes](https://github.com/storybook-vue/storybook-nuxt/compare/v0.1.8-alpha.0...v0.1.8)

### 📦 Build

- Storybook-static,still have nuxt inst issue ([ac15e16](https://github.com/storybook-vue/storybook-nuxt/commit/ac15e16))

### ❤️ Contributors

- ChakAs3 ([@chakAs3](http://github.com/chakAs3))

## v0.1.7

[compare changes](https://github.com/storybook-vue/storybook-nuxt/compare/v0.1.7-alpha.0...v0.1.7)

## v0.1.4

[compare changes](https://github.com/storybook-vue/storybook-nuxt/compare/v0.1.3...v0.1.4)

## v0.1.3

[compare changes](https://github.com/storybook-vue/storybook-nuxt/compare/v0.1.3-alpha.0...v0.1.3)
