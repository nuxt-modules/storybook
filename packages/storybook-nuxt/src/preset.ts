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
    renderer: '@storybook/vue3',
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
  console.log({ enabled, proxy })

  const CONFIG = mergeConfig(nuxtConfig.viteConfig, {
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
        rewrite: (path: string) =>{
        console.log('\n\n------ rewrite:path',path)
        const nn = path.replace('/__storybook_preview__', '/iframe.html')
        console.log('------ rewrite:new path',nn)
        return nn
      },
      ws:true 
    } },
      fs: { allow:[searchForWorkspaceRoot(process.cwd()),packageDir,runtimeDir,pluginsDir,componentsDir] }
    },
    preview: {
      headers: { "Access-Control-Allow-Origin": "*" , "Access-Control-Allow-Headers": "*"},
    },
    envPrefix: ['NUXT_'],
  });
  console.log('CONFIG \n', CONFIG.server.proxy)
  return CONFIG
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

function extendComponents(nuxt: Nuxt) {
  nuxt.hook('components:extend', (components: any) => {
    const nuxtLink = components.find(({ name }: any) => name === 'NuxtLink')
    nuxtLink.filePath = join(runtimeDir,'components/nuxt-link');
    nuxtLink.shortPath = join(runtimeDir,'components/nuxt-link');;
    nuxt.options.build.transpile.push(nuxtLink.filePath)      
  });
}

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
