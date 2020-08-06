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

By default, it will start the development server on [http://localhost:3003](http://localhost:3003), you can configure the port in the [options](/options#port) or with CLI options.

### CLI Options
Development command have some options you can pass to alter storybook behaviors.
```
-p, --port [number]           Port to run Storybook.
-h, --host [string]           Host to run Storybook
-s, --static-dir <dir-names>  Directory where to load static files from, comma-separated list. By default it loads Nuxt static dir
--smoke-test                  Exit after successful start
--ci                          CI mode (skip interactive prompts, don't open browser)
--quiet                       Suppress verbose build output
```

## Export

Export your Storybook into a static web application to deploy it to GitHub pages or any static hosting service:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn nuxt storybook build
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npx nuxt storybook build
  ```

  </code-block>
</code-group>

By default this command will output a `storybook-static/` directory. See command option to change output directory.

### CLI Options
Build command have some options you can pass to alter storybook behaviors.
```
-s, --static-dir <dir-names>  Directory where to load static files from, comma-separated list. By default it loads Nuxt static dir
-o, --output-dir [dir-name]   Directory where to store built files
--quiet  
```

## Eject
Generate manual config directory for Storybook 

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

This command will create a `storybook` directory and default configuration.

### CLI Options
```
--force  Force to overwrite config files if there are existed 
```
