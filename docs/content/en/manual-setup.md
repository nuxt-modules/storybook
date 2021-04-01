---
title: Manual Setup
description: '@nuxtjs/storybook provides a clean and simple way to integrate Storybook with NuxtJS. If you want to config Storybook by yourself or do things that is beyond the scope of this module follow these steps.'
position: 5
category: Advanced
---

`@nuxtjs/storybook` provides a clean and simple way to integrate Storybook with NuxtJS. If you want to config Storybook by yourself or do things that is beyond the scope of this module follow these steps.

Before starting, take a look at Storybook's official documentation about [Configuration](https://storybook.js.org/docs/configurations/overview/)

## User `eject` command
Using `eject` command is the easiest way to create and customize Storybook config.

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn nuxt storybook eject
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npx nuxt storybook eject
  ```

  </code-block>
</code-group>

After running `eject` command you'll see `.storybook` directory in your project's root dirctory.


## Manual
### Create `storybook` directory

In root directory of your project create `.storybook` directory. This directory will become your storybook's entry point.

### Create `main.js`

Create a new file inside `.storybook` directory called `main.js`, This is where you can import your stories.
A sample `main.js` files could be like this:
```js{}[main.js]
const { nuxifyStorybook } = require('../.nuxt-storybook/storybook/main.js')

module.exports = nuxifyStorybook({
  webpackFinal (config, options) {

    // extend config here
    
    return config
  },
  stories: [
    // Add your stories here
  ],
  addons: [
    // Add your addons here
  ]
})

```

Note that if you want to use Nuxt features in your storybook (like store or axios module and ...) you need to use `nuxifyStorybook` function in `main.js`.

### Create `preview.js`

Create another file called `preview.js` inside `.storybook` directory and import Nuxt helpers in it.
```js{}[preview.js]
export * from '~~/.nuxt-storybook/storybook/preview.js'
```

### Create `middleware.js`

This file is required if you plan to use Nuxt server middleware inside Storybook.

```js{}[middleware.js]
module.exports = require('../.nuxt-storybook/storybook/middleware.js')
```


All done, just start storybook and make your changes.

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn nuxt-storybook
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npx nuxt-storybook
  ```

  </code-block>
</code-group>
