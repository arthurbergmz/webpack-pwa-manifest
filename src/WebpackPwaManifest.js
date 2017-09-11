import validatePresets from './Presets'
import validateColors from './Colors'
import checkDeprecated from './Versioning'
import { buildResources, injectResources, generateHtmlTags, generateAppleTags, applyTag } from './Injector'

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
      ios: false,
      publicPath: null
    }, options || {})
    checkDeprecated(this.options, 'useWebpackPublicPath')
    this.options.short_name = this.options.short_name || this.options.name
    this.assets = null
    this.htmlPlugin = false
  }

  apply (compiler) {
    const _this = this
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
        if (!_this.htmlPlugin) _this.htmlPlugin = true
        buildResources(_this, _this.options.publicPath || compilation.options.output.publicPath, () => {
          if (_this.options.inject) {
            const tags = generateAppleTags(_this.options, _this.assets)
            const themeColorTag = {
              name: 'theme-color',
              content: _this.options['theme-color'] || _this.options.theme_color
            }
            if (themeColorTag.content) applyTag(tags, 'meta', themeColorTag)
            applyTag(tags, 'link', {
              rel: 'manifest',
              href: _this.options.filename
            })
            htmlPluginData.html = htmlPluginData.html.replace(
              /(<\/head>)/i,
              `${generateHtmlTags(tags)}</head>`
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
        buildResources(_this, _this.options.publicPath || compilation.options.output.publicPath, () => {
          injectResources(compilation, _this.assets, callback)
        })
      }
    })
  }
}

module.exports = WebpackPwaManifest
