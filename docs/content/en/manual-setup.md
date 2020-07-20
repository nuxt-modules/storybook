---
title: Manual Setup
description: ''
position: 1
category: Guide
categoryPosition: 3
---

`@nuxtjs/storybook` provides clean and simple way to integrate Storybook with Nuxtjs. But if you want to config storybook by yourself of do things that is beyond the scope of this module follow these steps.  
Before start, take a look at Storybook's oficial documentation about [Configuration](https://storybook.js.org/docs/configurations/overview/)

## Create `storybook` directory

In root directory of your project create `storybook` directory. This directory will become your storybook's entry point.

## Create `main.js`

Create a new file inside `storybook` directory called `main.js`, This is where you can import your stories.  
A sample `main.js` files could be like this:
```js{}[main.js]
module.exports = {
  webpackFinal(config, options) {
    config = options.nuxtStorybookConfig.webpackFinal(config, options)
    // add your awesome
    return config;
  },

  stories: [
    '~/components/**/*.stories.js'
  ],
}
```

Note that if you want to use Nuxt features in your storybook (like store or axios module and ...) you need to define a `webpackFinal` function in `main.js` and put this line `config = options.nuxtStorybookConfig.webpackFinal(config, options)` in the first line of function.

## Create `preview.js`

Create another file called `preview.js` inside `storybook` directory and import Nuxt helpers in it.
```js{}[preview.js]
import '~/.nuxt-storybook/storybook/preview.js'
```

All done, just start storybook and make your changes.

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn nuxt storybook
  ```

  </code-block>
</code-group>