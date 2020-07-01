const path = require('path')
const { readdirSync } = require('fs')

module.exports = function module (moduleOptions) {
  const options = {
    ...this.options.storybook,
    ...moduleOptions
  }
  // TODO: parse options and override user defined values like `stories` and `webpackFinal`
  copyTemplates.call(this, {})
}

function copyTemplates (options) {
  const templatesRoot = path.resolve(__dirname, '../templates')

  for (const file of readdirSync(templatesRoot)) {
    this.addTemplate({
      src: path.resolve(templatesRoot, file),
      fileName: path.join('storybook', file),
      options
    })
  }
}
