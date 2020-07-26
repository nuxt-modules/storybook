---
title: Setup
description: ''
position: 1
category: Guide
categoryPosition: 2
---

Using Storybook in your NuxtJS project is only one command away ✨

## Installation

1. Add `@nuxtjs/storybook` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add --dev @nuxtjs/storybook core-js@3
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install --save-dev @nuxtjs/storybook core-js@3
  ```

  </code-block>
</code-group>

2. Move to `core-js@3`:

Storybook requires that we move to `core-js@3`, which we can enable with a small tweak to our config:

```js[nuxt.config.js]
export default {
  build: {
    babel: {
      presets(_, [_preset, options]) {
        options.corejs = { version: 3 };
      }
    }
  }
}
```

3. Add `.nuxt-storybook` and `storybook-static` to your `.gitignore`:

```bash{}[.gitignore]
.nuxt-storybook
storybook-static
```

4. Start adding [stories](/usage)

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
