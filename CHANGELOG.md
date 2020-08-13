# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0-rc.1](https://github.com/nuxt-community/storybook/compare/v2.0.1-rc.1...v2.1.0-rc.1) (2020-08-13)


### Features

* **storybook:** custom Vue app based on nuxt `createApp` ([#80](https://github.com/nuxt-community/storybook/issues/80)) ([443fccd](https://github.com/nuxt-community/storybook/commit/443fccdba32a620b644393eb0a9ff3d6d1b69541))

### [2.0.1-rc.1](https://github.com/nuxt-community/storybook/compare/v2.0.0...v2.0.1-rc.1) (2020-08-12)


### Bug Fixes

* **storybook:** resolve nuxt aliases in globs ([#76](https://github.com/nuxt-community/storybook/issues/76)) ([94cfa26](https://github.com/nuxt-community/storybook/commit/94cfa266fe65b820f41601cb14249c84b656f34d))
* **storybook:** windows path resolve ([b93669b](https://github.com/nuxt-community/storybook/commit/b93669be4eb5b9c33508dcedf3773c4cc4adcefa))
* **webpack:** improve rules detection ([2b75646](https://github.com/nuxt-community/storybook/commit/2b756465e3dd7f79bfd8821da562e6ac8fc45a9a))

## [2.0.0](https://github.com/nuxt-community/storybook/compare/v1.2.0...v2.0.0) (2020-08-11)


### Features

* **storybook:** Migration to Storybook v6 ([#67](https://github.com/nuxt-community/storybook/issues/67)) ([cbccedd](https://github.com/nuxt-community/storybook/commit/cbcceddf92920908e0650fc2ac27768189f35d32))
* **storybook:** support multiple staticDir ([2c0a52e](https://github.com/nuxt-community/storybook/commit/2c0a52e40f23a55293c17b41c054b8ccc5891fb8))


### Bug Fixes

* **storybook:** escape win32 paths ([#63](https://github.com/nuxt-community/storybook/issues/63)) ([55c4869](https://github.com/nuxt-community/storybook/commit/55c4869fe6ec49927a6766fb06f24ffddc11a2ad))

## [1.2.0](https://github.com/nuxt-community/storybook/compare/v1.1.0...v1.2.0) (2020-08-07)


### Features

* **cli:** introduce `eject` command ([#54](https://github.com/nuxt-community/storybook/issues/54)) ([1fbdcab](https://github.com/nuxt-community/storybook/commit/1fbdcab9cfb66ced16cfd7c17ea61a8a9c61412a))
* **cli:** support nuxt's custom config file ([#61](https://github.com/nuxt-community/storybook/issues/61)) ([39caced](https://github.com/nuxt-community/storybook/commit/39cacedaaf78477ec6b120e22e3c34f77fa2f3fb))
* **cli:** support storybook flags ([#40](https://github.com/nuxt-community/storybook/issues/40)) ([3078602](https://github.com/nuxt-community/storybook/commit/307860246b476a082ddb80500985da0c3405b795))
* **storybook:** serve nuxt static dir ([#42](https://github.com/nuxt-community/storybook/issues/42)) ([680781a](https://github.com/nuxt-community/storybook/commit/680781a8eb46712a857c8db76e3653715fa5a7c8))


### Bug Fixes

* **cli:** run storybook in `development` env ([#47](https://github.com/nuxt-community/storybook/issues/47)) ([132bc31](https://github.com/nuxt-community/storybook/commit/132bc317024f5932804bb82a8fa8dde3ff3f8a1b))

## [1.1.0](https://github.com/nuxt-community/storybook/compare/v1.0.0...v1.1.0) (2020-08-02)


### Features

* **webpack:** Allow modules to modify webpack config ([b38d00d](https://github.com/nuxt-community/storybook/commit/b38d00de2cf4b5afc8166b8cfd455d5fe44a8f7e))
* **webpack:** Integrate Nuxt entry ([84fdc3e](https://github.com/nuxt-community/storybook/commit/84fdc3ed39e12bf3c237c9c174eca7c82a5b55db))


### Bug Fixes

* prevent `window.onNuxtReady` is `undefined` exception ([a7c9dc5](https://github.com/nuxt-community/storybook/commit/a7c9dc5fa04c48b4adf9d58514801ac0195acb5f))
* use `core-js@3` for storybook build ([4f33618](https://github.com/nuxt-community/storybook/commit/4f336181cda83e8a417c548220a9cb0f6fba732d))
* **cli:** add `arg` dependency ([5a1311d](https://github.com/nuxt-community/storybook/commit/5a1311d3ed74a5ce24e10e7f06bc88dc95f6bb2f))
* **cli:** disable version updates of storybook ([0503435](https://github.com/nuxt-community/storybook/commit/05034350c745f824dbb25d34181171ef8e7d0d48))
* **storybook:** catch plugins exceptions ([ebc00c0](https://github.com/nuxt-community/storybook/commit/ebc00c02b63f62719779722773605bb615b9d5bc))
* **storybook:** register components inside guard ([ac8611f](https://github.com/nuxt-community/storybook/commit/ac8611f2c2b8c87313ff31071aab7b6b0982525a))
* **storybook:** remove `[@nuxtjs](https://github.com/nuxtjs)` from stories path ([72c2044](https://github.com/nuxt-community/storybook/commit/72c204434ec9da2792ef172770fc7d76c72c9d9c))

## [1.0.0](https://github.com/nuxt-community/storybook/compare/v0.0.4...v1.0.0) (2020-07-31)

### [0.0.4](https://github.com/nuxt-community/storybook/compare/v0.0.3...v0.0.4) (2020-07-30)


### Bug Fixes

* **cli:** fallback to command if `dir` not exists ([153f11a](https://github.com/nuxt-community/storybook/commit/153f11acf7366158a83ff14a3e78219f2634d03b))
* **style:** force disable extractCSS ([3ed5d3c](https://github.com/nuxt-community/storybook/commit/3ed5d3c2938c75d2ed8286577ba532f7aab1cd4a))

### [0.0.3](https://github.com/nuxt-community/storybook/compare/v0.0.2...v0.0.3) (2020-07-29)


### Bug Fixes

* **webpack:** merge storybook webpack rules with nuxt ([34b7491](https://github.com/nuxt-community/storybook/commit/34b7491db50fa37b28a8a625ceea6c8ffd72fa56))
* allow using custom `srcDir` ([5f70899](https://github.com/nuxt-community/storybook/commit/5f70899a89e3c5bd03e2559eb03ddb6ea383ce25)), closes [#19](https://github.com/nuxt-community/storybook/issues/19)

### [0.0.2](https://github.com/nuxt-community/storybook/compare/v0.0.1...v0.0.2) (2020-07-29)


### Bug Fixes

* **cli:** put comands in currect order ([910556f](https://github.com/nuxt-community/storybook/commit/910556f1a1b83084a4960de5a062fe5f9045432f))

### 0.0.1 (2020-07-14)


### Features

* integrate nuxt plugins and loaders ([0539150](https://github.com/nuxt-community/nuxt/commit/0539150f21e82970dda7b409d649c59366016227))
* provide preview.js for manual setup ([2f4e1c1](https://github.com/nuxt-community/nuxt/commit/2f4e1c1f83f9dbd5e4e2179d72c776c0d511d483))
* static build ([296ff8c](https://github.com/nuxt-community/nuxt/commit/296ff8c9c0027f070b8b4e57cbbf0424b1eab157))
* typescript rewrite ([#9](https://github.com/nuxt-community/nuxt/issues/9)) ([758c17c](https://github.com/nuxt-community/nuxt/commit/758c17c5d3a68a547b5a4011da3eaba920ce19d0))


### Bug Fixes

* default rootDir to . ([2a4c837](https://github.com/nuxt-community/nuxt/commit/2a4c837303844ed965652fb9ee399e7d4f3ac792))
* detect nuxt features ([aa40706](https://github.com/nuxt-community/nuxt/commit/aa407062be7901497cc4f7ad377ea69b0141fb8b))
* load user-defined stories ([520b9cd](https://github.com/nuxt-community/nuxt/commit/520b9cd61d50010d88613c8a93a03fd3d86f0966))
* transpile storybook files ([0cf81db](https://github.com/nuxt-community/nuxt/commit/0cf81db3f40570867d2a4c6d326a9649bddfe0f0))
