/* eslint-disable import/no-unresolved */
import { join, resolve } from 'path';
import type { PresetProperty } from '@storybook/types';
import { mergeConfig, searchForWorkspaceRoot, type UserConfig as ViteConfig } from 'vite';
import type { Nuxt } from '@nuxt/schema';

import { fileURLToPath } from 'node:url'

const packageDir = resolve(fileURLToPath(import.meta.url), '../..')
const distDir = resolve(fileURLToPath(import.meta.url), '..')
const runtimeDir = resolve(distDir, 'runtime')
const pluginsDir = resolve(runtimeDir, 'plugins')
const componentsDir = resolve(runtimeDir, 'components')
const composableDir = resolve(runtimeDir, 'composables')

import type { StorybookConfig } from './types';

async function defineNuxtConfig(baseConfig: Record<string, any>) {
  const { loadNuxt, buildNuxt, addPlugin } = await import(require.resolve('@nuxt/kit'));
  const nuxt: Nuxt = await loadNuxt({
    rootDir: baseConfig.root,
    ready: false,
    dev: false,
  });

  if ((nuxt.options.builder as string) !== '@nuxt/vite-builder') {
    throw new Error(`Storybook-Nuxt does not support '${nuxt.options.builder}' for now.`);
  }
  
  let extendedConfig:ViteConfig = {};   
  
  nuxt.hook('modules:done', () => {
    addPlugin({
      src: join(runtimeDir,'plugins/storybook'),
      mode: 'client',
    });
    extendComposables(nuxt )  
    // Override nuxt-link component to use storybook router
    extendComponents(nuxt)
    extendPages(nuxt)

    nuxt.hook(
      'vite:extendConfig',
      (
        config: ViteConfig | PromiseLike<ViteConfig> | Record<string, any>,
        { isClient }: any
      ) => {
      
        if (isClient) {
          extendedConfig = mergeConfig(config, baseConfig);
        }
      }
    );
  });

  await nuxt.ready();
  
  try {
    await buildNuxt(nuxt);

    return {
      viteConfig: extendedConfig,
      nuxt,
    }
  }catch(e:any) {
    throw new Error(e);
  }
}
export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  return {
    ...config,
    builder:'@storybook/builder-vite',
    renderer: '@storybook-nuxt/framework',
  };
};
/**
 *
 * @param entry preview entries
 * @returns preview entries with nuxt runtime
 */
export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => {
  return [...entry, resolve(join(__dirname, "../preview"))];
};

export const viteFinal: StorybookConfig['viteFinal'] = async (
  config: Record<string, any>,
  options: any
) => {
  const  getStorybookViteConfig = async (c: Record<string, any>, o: any) => {
    const { viteFinal } = await import( require.resolve(join("@storybook/vue3-vite", "preset")));
    return viteFinal(c, o);
  }
  const nuxtConfig = await defineNuxtConfig(await getStorybookViteConfig(config, options));
  const { enabled, proxy } = getDevtoolsConfig(nuxtConfig.nuxt)


  return mergeConfig(nuxtConfig.viteConfig, {
    build: { rollupOptions: { external: ['vue','vue-demi'] } },
    define: {
      __NUXT__: JSON.stringify({ config: nuxtConfig.nuxt.options.runtimeConfig }),
    },
    server : { 
      cors : true ,
      proxy: { '/__storybook_preview__': { 
          target:`/iframe.html`,
          changeOrigin: false, 
          secure: false ,
          rewrite: (path: string) => path.replace('/__storybook_preview__', '/iframe.html'),
          ws:true 
        },
        ...(enabled ? proxy  :{})
      },
      fs: { allow:[searchForWorkspaceRoot(process.cwd()),packageDir,runtimeDir,pluginsDir,componentsDir,composableDir] }
    },
    preview: {
      headers: { "Access-Control-Allow-Origin": "*" , "Access-Control-Allow-Headers": "*"},
    },
    envPrefix: ['NUXT_'],
  });

};

/**
 *  Get devtools config from nuxt runtime config
 * @param nuxt 
 * @returns 
 */
export function getDevtoolsConfig(nuxt: Nuxt){  
  const devtools = nuxt.options.runtimeConfig.public['devtools'] as Record<string, any> || {}
  const port = devtools.port?.toString()  ??   '12442'
  const route = '/__nuxt_devtools__/client'
  const proxy = {  [ route ] : 
    { 
      target:`http://localhost:${port}${route}`,
      changeOrigin: true, 
      secure: false,
      rewrite: (path: string) => path.replace(route, ''),
      ws:true 
    }
  }
  return {
    enabled: nuxt.options.devtools,
    port,
    route,
    proxy
  }
}
/**
 * extend nuxt-link component to use storybook router
 * @param nuxt 
 */
function extendComponents(nuxt: Nuxt) {
  nuxt.hook('components:extend', (components: any) => {
    const nuxtLink = components.find(({ name }: any) => name === 'NuxtLink')
    nuxtLink.filePath = join(runtimeDir,'components/nuxt-link');
    nuxtLink.shortPath = join(runtimeDir,'components/nuxt-link');;
    nuxt.options.build.transpile.push(nuxtLink.filePath)      
  });
}

/**
 * extend routes to add  storybook-iframe page
 * @param nuxt 
 */

function extendPages(nuxt: Nuxt) {
  nuxt.hook('pages:extend', (pages: any) => {
  // console.log(' storyboo-iframe :',  pages.find(({ name }: any) => name === 'storybook-iframe'))
     pages.push({
       name: 'storybook-iframe',
       path: '/iframe.html',
       redirect:'/__storybook_preview__'
     })  
     
  })
}

/**
 * extend composables to override router ( fix undefined router  useNuxtApp )
 *
 * @param nuxt
 * */

function extendComposables(nuxt: Nuxt) {
   nuxt.hook('imports:extend', (imports: any) => {
     imports.push({name:'useRouter',filePath:join(runtimeDir,'composables/router')})
   })
}

