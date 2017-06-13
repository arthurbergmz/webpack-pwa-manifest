import validatePresets from './Presets'
import validateColors from './Colors'
import injectHtml from './Injector'

class WebpackPwaManifest {
  constructor (options) {
    validatePresets(options, 'dir', 'display', 'orientation')
    validateColors(options, 'background_color', 'theme_color')
    this.options = Object.assign({
      filename: 'manifest.json',
      name: 'App',
      orientation: 'portrait',
      display: 'standalone',
      start_url: '.',
      inject: true,
      fingerprints: true
    }, options || {})
    this.options.short_name = this.options.short_name || this.options.name
    this.assets = null
  }

  apply (compiler) {
    const _this = this
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
        injectHtml(_this, htmlPluginData, () => {
          if (_this.options.inject) {
            htmlPluginData.html = htmlPluginData.html.replace(
              /(<\/head>)/i, `<link rel="manifest" href="${_this.options.filename}" /></head>`
            )
          }
          callback(null, htmlPluginData)
        })
      })
    })
    compiler.plugin('emit', (compilation, callback) => {
      for (let asset of _this.assets) {
        compilation.assets[asset.file] = {
          source: () => asset.source,
          size: () => asset.size
        }
      }
      callback()
    })
  }
}

module.exports = WebpackPwaManifest
