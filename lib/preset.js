module.exports = {
  webpack (wConfig, { configType, rootDir = process.cwd() }) {
    const getWebpackConfig = require('./webpack')
    const isDev = configType === 'DEVELOPMENT'

    return getWebpackConfig(wConfig, { rootDir, isDev })
  }
}
