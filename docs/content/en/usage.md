---
title: Usage
description: ''
position: 2
category: Guide
categoryPosition: 2
---

## Start development

To start storybook in development environmnet:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn nuxt-storybook
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm run nuxt-storybook
  ```

  </code-block>
</code-group>

## Generate static web app

Export your storybook into a static web app. Then you can deploy it to GitHub pages or any static hosting service.

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn nuxt-storybook . build
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm run nuxt-storybook . build
  ```

  </code-block>
</code-group>