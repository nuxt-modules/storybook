# Storybook for Nuxt framework <!-- omit in toc -->

![sb-nuxt (2)](https://github.com/storybook-vue/nuxt/assets/711292/6cd06c77-1b6e-4a45-9666-a97d091a27c0)

Storybook package for [**Nuxt framework**](https://nuxt.com/) with zero configs. seamless integration supporting all Nuxt fancy features

https://github.com/storybook-vue/nuxt/assets/711292/e66a1899-ab7c-42dd-b358-59e22ff0f609

## Supported Features

👉 [Nuxt Modules](#nuxts-image-component)

👉 [Nuxt Plugins](#nuxt-font-optimization)

👉 [All in-built Nuxt Components](#nuxt-components)

👉 [Sass/Scss](#sassscss)

👉 [Css/Sass/Scss Modules](#csssassscss-modules)

👉 [ JSX ](#styled-jsx)

👉 [Postcss](#postcss)

👉 [Auto Imports](#auto-imports)

👉 [Runtime Config](#runtime-config)

👉 [Composables](#composables)

👉 [Typescript](#typescript) (already supported out of the box by Storybook)

👉 [Nuxt DevTools](https://devtools.nuxtjs.org/) : finally as Bonus, Nuxt DevTools works amazingly with your Storybook, full features

https://github.com/storybook-vue/nuxt/assets/711292/63cc1fb3-ec6b-4df2-ad61-d87e5692f385

## Requirements

- Node.js 22+
- [Nuxt](https://nuxt.com/) 3.18.1+ or 4.x
- [Storybook](https://storybook.js.org/) 11.x

## Getting Started

Install `@storybook-vue/nuxt` next to Storybook 11, published under the `next` tag until its release:

```bash
npm install -D @storybook-vue/nuxt storybook@next @storybook/addon-docs@next
```

Then point `.storybook/main.ts` to the framework with [CSF Factories](https://storybook.js.org/docs/api/csf/csf-next):

```ts
// .storybook/main.ts
import { defineMain } from '@storybook-vue/nuxt/node'

export default defineMain({
  stories: ['../components/**/*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook-vue/nuxt',
})
```

```ts
// .storybook/preview.ts
import addonDocs from '@storybook/addon-docs'
import { definePreview } from '@storybook-vue/nuxt'

export default definePreview({
  addons: [addonDocs()],
})
```

Run `storybook dev` to start Storybook on its own port, or add the [`@nuxtjs/storybook`](https://www.npmjs.com/package/@nuxtjs/storybook) module to serve it from `nuxt dev`.

## Documentation

Read the [Nuxt Storybook documentation](https://storybook.nuxtjs.org) for the configuration, `parameters.nuxt`, and the `mockNuxtImport`, `mockComponent` and `registerEndpoint` helpers.

## License

This repository is licensed under the [MIT License](LICENSE). Feel free to use the code and modify it according to your needs.

## Contacts :

🔖 Mail: javachakir@gmail.com

💬 Discord: ChakAs3

🐦‍⬛ Twitter: [@ChakirQatab](https://twitter.com/ChakirQatab)
