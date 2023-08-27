import { logger, defineNuxtModule, createResolver, addImportsDir, extendViteConfig } from '@nuxt/kit';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { startSubprocess } from '@nuxt/devtools-kit';

async function setupStorybook(nuxt) {
  const inited = await existsSync(resolve(nuxt.options.rootDir, ".storybook"));
  logger.log(" setupStorybook : ", nuxt.options.dev ? "DevMode" : "Prod", { inited });
  const projectDir = resolve(nuxt.options.rootDir);
  const args = inited ? ["storybook", "dev", "--port", "6006", "--ci"] : ["storybook-nuxt", "init", "--yes", "--force", "--ci"];
  logger.log(" args : ", args);
  logger.log(" projectDir : ", projectDir);
  if (!nuxt.options.dev)
    return;
  const _process = startSubprocess(
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

const module = defineNuxtModule({
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
    const { resolve } = createResolver(import.meta.url);
    nuxt.options.ssr = false;
    const runtimeDir = resolve("./runtime");
    nuxt.options.build.transpile.push(runtimeDir);
    addImportsDir(resolve(runtimeDir, "composables"));
    extendViteConfig((config) => {
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
    logger.info(`StorybookAdmin URL: ${STORYBOOK_URL}`);
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

export { module as default };
