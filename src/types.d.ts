
export interface WebpackExtras {
  configType: string;
  isDev: boolean;
  nuxt: any;
  nuxtBuilder: any;
  nuxtWebpackConfig: any;
}

export interface StorybookOptions {
  rootDir: string;
  mode: string;
  outputDir?: string;
  quiet?: boolean;
}
