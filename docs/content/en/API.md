---
title: API
description: '@nuxtjs/storybook provides a clean and simple way to integrate NuxtJS modules with Storybook.'
position: 5
category: Advanced
---

## Config Hook

As of Version 3 `@nuxtjs/storybook` will provide API for modules to modify Storybook config and add their own stories. Modules can use `storybook:config` hook to access Storybook config and add their own stories.

Here is a sample example:

<code-group>
  <code-block label="Module" active>

  ```js{}[your-awesome-module/index.js]
  export default function() {
    const { nuxt } = this

    nuxt.hook('storybook:config', ({ stories }) => {
      stories.push("your-awesome-module/stories/*.stories.js")
    })
  }
  ```

  </code-block>

  <code-block label="Story">

  ```js{}[your-awesome-module/stories/awesome.stories.js]
  export default {
    title: "Awesome Story"
  }

  export const awesome = () => "<div>AWESOME</div>"
  ```

  </code-block>
</code-group>

Just like that, now everyone that uses `your-awesome-module` will see your story inside Storybook.