import { Configuration as WebpackConfiguration } from 'webpack'
import { getWebpackConfig } from './webpack'
import { WebpackExtras } from './types'

export default {
  webpack (config: WebpackConfiguration, extras: WebpackExtras): WebpackConfiguration {
    extras.isDev = extras.configType === 'DEVELOPMENT'

    return getWebpackConfig(config, extras)
  }
}
