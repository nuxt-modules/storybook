![Nuxt Storybook](https://github.com/nuxt-modules/storybook/assets/904724/0396b16c-be9b-4b0d-83b5-5e35dd8298df)

# Nuxt Storybook

Integrate [Storybook](http://storybook.js.org) into your [Nuxt](https://nuxt.com) application.

## Installing

```bash
npx nuxi@latest module add storybook
npm install -D storybook@next
```

Storybook 11 is published under the `next` tag until its release. The first command adds `@nuxtjs/storybook` to the `modules` of your `nuxt.config`:

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/storybook'],
})
```

Then run `nuxt dev`: Storybook is served by the Nuxt dev server under `/_storybook/` (`http://localhost:3000/_storybook/` by default).

Read the [documentation](https://storybook.nuxtjs.org) to set up `.storybook/main.ts` and write your first stories.

## Features

👌 Zero configuration to start

🔌 Served by `nuxt dev`, on the same host and port as your app

🎨 Devtools tab with the Storybook app

🏭 [CSF Factories](https://storybook.js.org/docs/api/csf/csf-next) with typed `parameters.nuxt`

🧪 Mock auto-imports, components and server endpoints in your stories

📦 Extendable by Nuxt modules

🚀 Supports Nuxt 3 and Nuxt 4 with Storybook 11

## Requirements

- Node.js 22+
- Nuxt 3.18.1+ or Nuxt 4.x
- Storybook 11.x

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
