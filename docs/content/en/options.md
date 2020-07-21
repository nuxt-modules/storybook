---
title: Options
description: 'You can configure the integration easily with the storybook property.'
position: 4
category: Guide
categoryPosition: 2
---

To configure the integration, you can use `storybook` property in the `nuxt.config.js`:

```js{}[nuxt.config.js]
export default {
  storybook: {
    // Options
  }
}
```

## `addons`

- Default: `[]`

Register third party addons.  

```js{}[nuxt.config.js]
export default {
  storybook: {
    addons: [
      '@storybook/addon-knobs/register',
      '@storybook/addon-notes/register',
    ]
  }
}
```

<base-alert type="info">

`@nuxtjs/storybook` internally registered some third party addons.

You don't need to register these addons in your project:
- `@storybook/addon-actions/register` 

</base-alert>

## `stories`

With this option you can register your custom stories to Storybook. For example, If your stories are located in the `stories` directory, you can use the following snippet:

```js{}[nuxt.config.js]
export default {
  storybook: {
    stories: [
      '~/stories/**/*.stories.js',
      '~/custom/path/sample.stories.js'
    ],
  }
}
```
<base-alert type="info">

By default `@nuxtjs/storybook` load all stories inside `~/components`. You don't need to add this directory.

</base-alert>

## `port`

- Default: `3003`

Port to run Storybook

```js{}[nuxt.config.js]
export default {
  storybook: {
    // Run Storybook on localhost:4000
    port: 4000
  }
}
```

## `webpackFinal`

To customize Storybook's webpack config, you can create `webpackFinal`. `webpackFinal` is applied to the preview config after all presets have been applied.

```js{}[nuxt.config.js]
export default {
  storybook: {
    webpackFinal(config, { configDir }) {
      // manipulate webpack config
      return config;
    }
  }
}
```
