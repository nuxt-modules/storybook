
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
  configFile?: string;
  outputDir?: string;
  tsconfig?: string;
  staticDir?: string;
  quiet?: boolean;
  smokeTest?: Boolean;
  ci?: Boolean;
  port?: Number;
  host?: String;
  force?: boolean;
  webpackStatsJson?: string;
}
