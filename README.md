
![sb-nuxt-github (1)](https://github.com/storybook-vue/nuxt-storybook/assets/711292/7e64e6cc-7d03-469d-91e6-48fa6754a52f)

# nuxt-storybook

Storybook Module for Nuxt Framework

> [Storybook](http://storybookjs.org) module for [Nuxt](https://nuxtjs.org)
>
## Installing

`pnpm add @storybook-vue/nuxt-storybook -D`

update your nuxt.config

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

`pnpm dev`

## Contributing

1. Install dependencies with `pnpm`.
2. Run `pnpm dev:prepare` to generate stubbed `dist` directory.
3. Make your changes.
4. Run `pnpm lint`  to verify that there is no issues (consider adding tests).
5. Submit a PR.

## License

[MIT License](./LICENSE)
