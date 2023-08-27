'use strict';

const kit = require('@nuxt/kit');
const node_path = require('node:path');
const node_fs = require('node:fs');
const devtoolsKit = require('@nuxt/devtools-kit');

async function setupStorybook(nuxt) {
  const inited = await node_fs.existsSync(node_path.resolve(nuxt.options.rootDir, ".storybook"));
  kit.logger.log(" setupStorybook : ", nuxt.options.dev ? "DevMode" : "Prod", { inited });
  const projectDir = node_path.resolve(nuxt.options.rootDir);
  const args = inited ? ["storybook", "dev", "--port", "6006", "--ci"] : ["storybook-nuxt", "init", "--yes", "--force", "--ci"];
  kit.logger.log(" args : ", args);
  kit.logger.log(" projectDir : ", projectDir);
  if (!nuxt.options.dev)
    return;
  const _process = devtoolsKit.startSubprocess(
    {
      command: "npx",
      args,
      cwd: projectDir
    },
    {
      id: "nuxt-storybook-module:client",
      name: "Nuxt Storybook Module Client Dev"
    },
    nuxt
  );
  _process.getProcess().stdout?.pipe(process.stdout);
  _process.getProcess().stderr?.pipe(process.stderr);
  nuxt.hook("close", () => _process.terminate());
}

const module$1 = kit.defineNuxtModule({
  meta: {
    name: "@storybook-vue/nuxt-storybook",
    configKey: "storybook",
    compatibility: {
      nuxt: "^3.0.0"
    }
  },
  defaults: {
    url: process.env.STORYBOOK_URL || "http://localhost:6006",
    storybookRoute: "/__storybook",
    port: 6006,
    version: "v7",
    cookieName: "sb_session",
    devtools: false
  },
  setup(options, nuxt) {
    const STORYBOOK_URL = options.url || "http://localhost:6006";
    const STORYBOOK_ROUTE = options.storybookRoute || "/__storybook";
    const STORYBOOK_PORT = options.port || 6006;
    const { resolve } = kit.createResolver((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (document.currentScript && document.currentScript.src || new URL('module.cjs', document.baseURI).href)));
    nuxt.options.ssr = false;
    const runtimeDir = resolve("./runtime");
    nuxt.options.build.transpile.push(runtimeDir);
    kit.addImportsDir(resolve(runtimeDir, "composables"));
    kit.extendViteConfig((config) => {
      var _a;
      config.optimizeDeps ?? (config.optimizeDeps = {});
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      config.server ?? (config.server = {});
      (_a = config.server).proxy ?? (_a.proxy = {});
      config.server.proxy[STORYBOOK_ROUTE] = {
        target: `http://localhost:${STORYBOOK_PORT}${STORYBOOK_ROUTE}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(STORYBOOK_ROUTE, "")
      };
    });
    kit.logger.info(`StorybookAdmin URL: ${STORYBOOK_URL}`);
    setupStorybook(nuxt);
    nuxt.hook("devtools:customTabs", (tabs) => {
      tabs.push({
        // unique identifier
        name: "nuxt-storybook",
        // title to display in the tab
        title: "Storybook",
        // any icon from Iconify, or a URL to an image
        icon: "devicon:storybook",
        // iframe view
        view: {
          type: "iframe",
          src: STORYBOOK_ROUTE
        }
      });
    });
  }
});

module.exports = module$1;
