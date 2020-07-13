---
title: Setup
description: ''
position: 1
category: Guide
categoryPosition: 2
---

Check the [Nuxt.js documentation](https://nuxtjs.org/api/configuration-modules#the-modules-property) for more information about installing and using modules in Nuxt.js.

## Installation

Add `@nuxtjs/storybook` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add --dev @nuxtjs/storybook
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install --save-dev @nuxtjs/storybook
  ```

  </code-block>
</code-group>

## Configure

Then, add `storybook` section in `nuxt.config.js`:

```js[nuxt.config.js]
export default {
  storybook: {
    // Options
  }
}
```

See [module options](/options).