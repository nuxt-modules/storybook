---
title: Setup
description: ''
position: 1
category: Guide
---

Using Storybook in your NuxtJS project is only one command away ✨

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


<alert type="warning">
If you are using <b>Nuxt < 2.14.0</b>, you need to <a href="https://github.com/nuxt/nuxt.js/tree/v2.13.3/packages/babel-preset-app#example-2-use-core-js3">use `core-js@3`</a>
</alert>

Next, add `.nuxt-storybook` and `storybook-static` to your `.gitignore`:

```bash{}[.gitignore]
.nuxt-storybook
storybook-static
```

That's it ✨!

Now you can start adding [stories](/usage).

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
