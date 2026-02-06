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
    host: 'http://localhost',
    route: '/_storybook',
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

🚀 Supports Nuxt 3 and Nuxt 4 with Storybook 10

## Requirements

- Node.js 20.19+, 22.12+, or 24+
- Nuxt 3.18.1+ or Nuxt 4.x
- Storybook 10.x

## Version Compatibility

| Module Version | Storybook | Nuxt |
|----------------|-----------|------|
| v10.x | 10.x | 3.18.1+ / 4.x |
| v9.x | 8.x / 9.x | 3.x |
| v4.x | 6.x | 2.x (v4 branch) |

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
