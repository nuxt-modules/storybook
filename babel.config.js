module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        loose: true,
        targets: {
          esmodules: true
        }
      }
    ]
  ]
}
