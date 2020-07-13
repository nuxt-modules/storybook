---
title: options
description: ''
position: 2
category: API
categoryPosition: 3
---

## `port`

- Default: `3000`

Port to run Storybook


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
**Note**: `@nuxtjs/storybook` internally registered some third party addons. You don't need to register these addons in your project. Internal addons are:
- `@storybook/addon-actions/register` 

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