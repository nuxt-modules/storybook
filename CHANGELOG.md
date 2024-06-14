# Changelog

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
