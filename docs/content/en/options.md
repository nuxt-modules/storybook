---
title: Options
description: 'You can configure the integration easily with the storybook property.'
position: 4
category: Guide
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
      '@storybook/addon-controls',
      '@storybook/addon-notes',
    ]
  }
}
```

You can pass configurations by using Object addon declaration and adding the configurations under the `option` key. For example if you want to use `@storybook/preset-scss` with custom configuration you can do this:
```js{}[nuxt.config.js]
export default {
  storybook: {
    addons: [
      {
        name: '@storybook/preset-scss',
        options: {
          cssLoaderOptions: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
          }
        }
      }
    ]
  }
}
```

<alert type="info">

`@nuxtjs/storybook` internally registered some third party addons.

You don't need to register these addons in your project:
- `@storybook/addon-essntials`

</alert>

## `stories`

- Default: `[]`

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
<alert type="info">

By default `@nuxtjs/storybook` load all stories inside `~/components`. You don't need to add this directory.

</alert>

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

## `parameters`

- Default: `{}`

> Parameters are a set of static, named metadata about a story, typically used to control the behavior of Storybook features and addons.[*](https://storybook.js.org/docs/react/writing-stories/parameters)

Customize Storybook's global parameters.  

```js{}[nuxt.config.js]
export default {
  storybook: {
    parameters: {
      backgrounds: {
        default: 'white',
        values: [
          { name: 'white', value: '#ffffff' },
          { name: 'gray', value: '#aaaaaa' },
        ],
      },
    }
  }
}
```

## `exclude`

- Default: `[]`

As of Version 3 `@nuxtjs/storybook` will provide an API for modules to modify Storybook config and add their own stories. If you want to exclude stories of specific module you can use this option.  

```js{}[nuxt.config.js]
export default {
  storybook: {
    exclude: [
      'module_name',
    ]
  }
}
```