import validatePresets from './Presets'
import validateColors from './Colors'
import { buildResources, injectResources } from './Injector'

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
      fingerprints: true,
      useWebpackPublicPath: false
    }, options || {})
    this.options.short_name = this.options.short_name || this.options.name
    this.assets = null
    this.htmlPlugin = false
  }

  apply (compiler) {
    const _this = this
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
        if (!_this.htmlPlugin) _this.htmlPlugin = true
        buildResources(_this, _this.options.useWebpackPublicPath ? htmlPluginData.assets.publicPath : null, () => {
          if (_this.options.inject) {
            htmlPluginData.html = htmlPluginData.html.replace(
              /(<\/head>)/i,
              `<link rel="manifest" href="${_this.options.filename}" /></head>`
            )
          }
          callback(null, htmlPluginData)
        })
      })
    })
    compiler.plugin('emit', (compilation, callback) => {
      if (_this.htmlPlugin) {
        injectResources(compilation, _this.assets, callback)
      } else {
        buildResources(_this, _this.options.useWebpackPublicPath ? compilation.options.output.publicPath : null, () => {
          injectResources(compilation, _this.assets, callback)
        })
      }
    })
  }
}

module.exports = WebpackPwaManifest
