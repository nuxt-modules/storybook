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
  yarn add --dev @nuxtjs/storybook postcss@latest
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install --save-dev @nuxtjs/storybook postcss@latest
  ```

  </code-block>
</code-group>


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
