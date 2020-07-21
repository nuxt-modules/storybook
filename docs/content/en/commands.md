---
title: Commands
description: '@nuxtjs/storybook is shipped with multiple commands, making easy to develop or ship the UI for production'
position: 3
category: Guide
categoryPosition: 2
---

`@nuxtjs/storybook` is shipped with multiple commands, making easy to develop or ship the UI for production.

## Development

To start Storybook in development environment:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn nuxt storybook
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npx nuxt storybook
  ```

  </code-block>
</code-group>

By default, it will start the development server on [http://localhost:3003](http://localhost:3003), you can configure the port in the [options](/options#port).

## Export

Export your Storybook into a static web application to deploy it to GitHub pages or any static hosting service:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn nuxt storybook . build
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npx nuxt storybook . build
  ```

  </code-block>
</code-group>

This command will output a `storybook-static/` directory.
