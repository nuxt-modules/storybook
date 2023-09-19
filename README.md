![Nuxt Storybook](https://github.com/nuxt-modules/storybook/assets/904724/0396b16c-be9b-4b0d-83b5-5e35dd8298df)

# Nuxt Storybook

Integrate [Storybook](http://storybook.js.org) into your [Nuxt](https://nuxt.com) application.

## Installing

```
pnpm add -D @storybook-vue/nuxt-storybook
```

Update your `nuxt.config`:

```ts
  modules: [
    '@storybook-vue/nuxt-storybook',
  ],
  storybook: {
    url: 'http://localhost:6006',
    storybookRoute: '/__storybook__',
    port: 6006,
  },
```

Then run `pnpm dev` to start you Nuxt server.

## Demo

https://github.com/chakAs3/nuxt-storybook-module-demo

## Features

👌  Zero configuration to start (see video)
🪄  Access Storybook Terminal
🎨  Devtools tab with Storybook app
⚙️  Reference your Storybook config in your app
📦  Extendable by Nuxt modules
🚀  Supports both Nuxt 3 and Nuxt 2

## Contributing

1. Install dependencies with `pnpm`.
2. Run `pnpm dev:prepare` to generate stubbed `dist` directory.
3. Make your changes.
4. Run `pnpm lint`  to verify that there is no issues (consider adding tests).
5. Submit a PR.

## License

This repository is licensed under the [MIT License](LICENSE). Feel free to use the code and modify it according to your needs.

## Contacts :

🔖 Mail: javachakir@gmail.com

💬 Discord: ChakAs3

🐦‍⬛ Twitter: [@ChakirQatab](https://twitter.com/ChakirQatab)
