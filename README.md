# @nuxtjs/storybook

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Storybook integration with Nuxt

[📖 **Release Notes**](./CHANGELOG.md)

🚧 WIP 🚧

## Quick Setup

Yarn:

```bash
# Using yarn
yarn add -D @nuxtjs/storybook

# Using npm
npm install -D @nuxtjs/storybook
```

Create `.storybook/main.js`:

```js
module.exports = {
  stories: [
    '../components/*.stories.js'
  ]
}
```

Now you can use `nuxt storybook` to start!

## Alternative Usage

Alternatively, you can use nuxt-storybook as a preset and use `@storybook/vue` (not recommended)

```js
module.exports = {
  presets: [
    require.resolve('@nuxt/storybook/lib/preset')
  ]
}
```

You can now use `npx start-storybook`

## Development

1. Clone this repository
2. Install dependencies using `yarn install`
3. Start storybook server using `yarn storybok`

## License

[MIT License](./LICENSE)

Copyright (c)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/storybook/latest.svg
[npm-version-href]: https://npmjs.com/package/@nuxtjs/storybook

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs/storybook.svg
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/storybook

[github-actions-ci-src]: https://github.com/nuxt-community/storybook-module/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/nuxt-community/storybook-module/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/storybook-module.svg
[codecov-href]: https://codecov.io/gh/nuxt-community/storybook-module

[license-src]: https://img.shields.io/npm/l/@nuxtjs/storybook.svg
[license-href]: https://npmjs.com/package/@nuxtjs/storybook
