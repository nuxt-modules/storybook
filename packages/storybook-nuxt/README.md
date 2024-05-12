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

- [Nuxt](https://nuxt.com/) >= 3.x
- [Storybook](https://storybook.js.org/) >= 7.x

## Demo

Checkout the demo repo [storybook7-nuxt3-demo](https://github.com/storybook-vue/storybook-nuxt-demo)
or try it on [Stackblitz](https://stackblitz.com/~/github.com/storybook-vue/storybook-nuxt-demo)

## Getting Started

### In a project without Storybook

Follow the prompts after running this command in your Nuxt project's root directory:

```bash
npx storybook-nuxt init
```

[More on getting started with Storybook](https://storybook.js.org/docs/vue3/get-started/install)

#### Automatic migration

When running the `upgrade` command above, you should get a prompt asking you to migrate to `@storybook-vue/nuxt`, which should handle everything for you. In case auto-migration does not work for your project, refer to the manual migration below.

Update your `main.js` to change the framework property:

```js
// .storybook/main.js
export default {
  // ...
  framework: {
    name: '@storybook-vue/nuxt', // Add this
    options: {},
  },
}
```

## Documentation

In progress

## License

This repository is licensed under the [MIT License](LICENSE). Feel free to use the code and modify it according to your needs.

## Contacts :

🔖 Mail: javachakir@gmail.com

💬 Discord: ChakAs3

🐦‍⬛ Twitter: [@ChakirQatab](https://twitter.com/ChakirQatab)
