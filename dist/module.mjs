import { logger, defineNuxtModule, createResolver, addImportsDir, extendViteConfig } from '@nuxt/kit';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { startSubprocess } from '@nuxt/devtools-kit';
import { getPort } from 'get-port-please';

async function setupStorybook(options, nuxt) {
  const projectDir = resolve(nuxt.options.rootDir);
  const args = isStorybookInstalled(projectDir) ? ["storybook", "dev", "--port", options.port ?? "6006", "--ci"] : ["storybook-nuxt@next", "init"];
  logger.info(" ");
  logger.info("\u{1F4DA}  Starting Storybook  ");
  logger.info("   Storybook args: ", args);
  logger.info("");
  if (!nuxt.options.dev)
    return;
  nuxt.hook("app:resolve", async () => {
    logger.info(" ");
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
    nuxt.hook(
      "close",
      () => {
        logger.info("\u{1F4DA} Closing Storybook  ");
        return _process.terminate();
      }
    );
    await new Promise((resolve2) => setTimeout(resolve2, 2e3));
    logger.info("\u{1F4DA} Storybook ready  ");
  });
}
function isStorybookInstalled(rootDir) {
  const isTypeScriptProject = existsSync(resolve(rootDir, "tsconfig.json"));
  const configFileExtension = isTypeScriptProject ? "ts" : "js";
  const sbMain = existsSync(resolve(rootDir, `.storybook/main.${configFileExtension}`));
  return sbMain;
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
    storybookRoute: "/__storybook_route",
    port: 6006,
    version: "v7",
    cookieName: "sb_session",
    devtools: false
  },
  async setup(options, nuxt) {
    console.log(" devtools :", nuxt.options.devtools);
    if (process.env.__STORYBOOK__)
      return;
    logger.info("Storybook Module Setup");
    logger.info("--  setup :", options);
    const STORYBOOK_ROUTE = options.storybookRoute || "/__storybook_route";
    const STORYBOOK_PORT = await getPort({ ports: [options.port || 6006, 6007, 6008, 6009, 6010] });
    const STORYBOOK_URL = "http://localhost:" + STORYBOOK_PORT;
    options.port = STORYBOOK_PORT;
    process.env.__STORYBOOK__ = JSON.stringify(options);
    process.env.STORYBOOK_PORT = JSON.stringify(STORYBOOK_PORT);
    const { resolve } = createResolver(import.meta.url);
    nuxt.options.ssr = false;
    const runtimeDir = resolve("./runtime");
    resolve(runtimeDir, "composables");
    nuxt.options.build.transpile.push(runtimeDir);
    addImportsDir(resolve(runtimeDir, "composables"));
    extendViteConfig((config) => {
      var _a;
      logger.info("  ");
      logger.info(`\u{1F50C}  extendViteConfig : `);
      config.optimizeDeps ?? (config.optimizeDeps = {});
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      logger.info(`http://localhost:${STORYBOOK_PORT}`);
      nuxt.options.devtools = true;
      config.server ?? (config.server = {});
      (_a = config.server).proxy ?? (_a.proxy = {});
      config.server.proxy[STORYBOOK_ROUTE] = {
        target: `http://localhost:${STORYBOOK_PORT}/`,
        changeOrigin: true,
        followRedirects: true,
        secure: false,
        ws: true,
        rewrite: (path) => {
          console.log("---path :", path);
          console.log(
            `http://localhost:${STORYBOOK_PORT}`
          );
          const newpath = path.replace(STORYBOOK_ROUTE, "");
          console.log("--->newpath :", newpath);
          return newpath;
        }
      };
      config.server.proxy["/storybook-server-channel"] = {
        target: `http://localhost:${STORYBOOK_PORT}/storybook-server-channel`,
        changeOrigin: true,
        followRedirects: true,
        secure: false,
        ws: true
      };
    });
    await setupStorybook(options, nuxt);
    logger.info("");
    logger.info("Options.devtools :", nuxt.options.devtools, " STORYBOOK_URL :", STORYBOOK_URL);
    if (nuxt.options.devtools) {
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
            // absolute URL to the iframes
            src: `${STORYBOOK_URL}/?path=/docs/`
          }
        });
      });
    }
  }
});

export { module as default };
