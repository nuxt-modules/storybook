---
title: Options
description: ''
position: 2
category: 'Guide'
categoryPosition: 4
---

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

Load stories by filename. For example, if your stories files are located in the `components` directory, you can use the following snippet:

```js{}[nuxt.config.js]
export default {
  storybook: {
    stories: [
      '~/components/**/*.stories.js',
      '~/custom/path/sample.stories.js'
    ],
  }
}
```

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
