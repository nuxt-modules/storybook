![Nuxt Storybook](https://github.com/nuxt-modules/storybook/assets/904724/0396b16c-be9b-4b0d-83b5-5e35dd8298df)

# Nuxt Storybook

Integrate [Storybook](http://storybook.js.org) into your [Nuxt](https://nuxt.com) application.

## Installing

```
npx nuxi@latest module add storybook
```

Update your `nuxt.config`:

```ts
  modules: [
    '@nuxtjs/storybook',
  ],
  storybook: {
    url: 'http://localhost:6006',
    storybookRoute: '/__storybook__',
    port: 6006,
  },
```

Then run `pnpm dev` to start your Nuxt server.

## Demo

https://github.com/storybook-vue/nuxt-storybook-module-demo

## Features

👌 Zero configuration to start (see video)

🪄 Access Storybook Terminal

🎨 Devtools tab with Storybook app

⚙️ Reference your Storybook config in your app

📦 Extendable by Nuxt modules

🚀 Supports Nuxt 3 / Storybook 8

## Known Limitations

### Nuxt 4.2.0+ Compatibility

**This module currently requires Nuxt `^4.0.0 <4.2.0` (last tested version: 4.1.3).**

Nuxt 4.2.0 introduced changes to Vite plugin environment compatibility ([PR #33445](https://github.com/nuxt/nuxt/pull/33445)) that break the integration with Storybook 10's ESM-only architecture. When using Nuxt 4.2.0+, the Nuxt dev server fails to serve `/_nuxt/*` assets correctly when Storybook is running.

**Workaround:** Pin Nuxt to version `4.1.3` until this issue is resolved:

```json
{
  "dependencies": {
    "nuxt": "4.1.3"
  }
}
```

We're working with the Nuxt team to resolve this compatibility issue. See [issue #XXX](https://github.com/nuxt-modules/storybook/issues/XXX) for updates.

## Nuxt 2

Nuxt 2 is supported with Storybook v6, you can check legacy code on the v4 branch.

## Contributing

1. Install dependencies with `pnpm`.
2. Run `pnpm dev:prepare` to generate stubbed `dist` directory.
3. Make your changes.
4. Run `pnpm lint` to verify that there are no issues (consider adding tests).
5. Submit a PR.

## License

This repository is licensed under the [MIT License](LICENSE). Feel free to use the code and modify it according to your needs.

## Contacts :

🔖 Mail: javachakir@gmail.com

💬 Discord: ChakAs3

🐦‍⬛ Twitter: [@ChakirQatab](https://twitter.com/ChakirQatab)

## Sponsors

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.
