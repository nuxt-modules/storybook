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

## Configuration

### Vite Optimization

If you encounter race conditions or module resolution errors during initial Storybook load, you can add the following `viteFinal` configuration to your `.storybook/main.js`:

```js
export default {
  // ... other config
  async viteFinal(config) {
    // Pre-bundle dependencies to avoid race condition on initial load
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include || []),
        '@storybook/vue3-vite',
        '@storybook/vue3/entry-preview',
        'react/jsx-runtime',
        'react',
        'react-dom/client',
      ],
      // Force pre-bundling on every start to ensure deps are ready
      force: true,
    }
    // Disable strict file system access for more stability
    config.server = {
      ...config.server,
      fs: {
        ...config.server?.fs,
        strict: false,
      },
    }
    return config
  },
}
```

This configuration ensures that Storybook's internal dependencies are pre-bundled before the initial load, preventing race conditions and "failed to fetch dynamically imported module" errors.

## Demo

https://github.com/storybook-vue/nuxt-storybook-module-demo

## Features

👌 Zero configuration to start (see video)

🪄 Access Storybook Terminal

🎨 Devtools tab with Storybook app

⚙️ Reference your Storybook config in your app

📦 Extendable by Nuxt modules

🚀 Supports Nuxt 3.18.1+ and Nuxt 4+ / Storybook 10+

## Requirements

- Node.js 20.19+, 22.12+, or 24+
- Nuxt 3.18.1 or later (including Nuxt 4.x)
- Storybook 10.0.0 or later (ESM-only)

## Previous Versions

- **Nuxt 3** (< 3.18.1): Use v8.x or earlier with Storybook 8 or 9
- **Nuxt 2**: Use v4.x with Storybook v6 (check the v4 branch for legacy code)

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
