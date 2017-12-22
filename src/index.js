import validatePresets from './validators/presets'
import validateColors from './validators/colors'
import checkDeprecated from './validators/versioning'
import { buildResources, injectResources, generateHtmlTags, generateAppleTags, applyTag } from './injector'

class WebpackPwaManifest {
  constructor (options = {}) {
    validatePresets(options, 'dir', 'display', 'orientation')
    validateColors(options, 'background_color', 'theme_color')
    checkDeprecated(options, 'useWebpackPublicPath')
    this.assets = null
    this.htmlPlugin = false
    const shortName = options.short_name || options.name || 'App'
    this.options = Object.assign({
      filename: 'manifest.json',
      name: 'App',
      short_name: shortName,
      orientation: 'portrait',
      display: 'standalone',
      start_url: '.',
      inject: true,
      fingerprints: true,
      ios: false,
      publicPath: null,
      includeDirectory: true
    }, options)
  }

  apply (compiler) {
    const that = this
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
        if (!that.htmlPlugin) that.htmlPlugin = true
        buildResources(that, that.options.publicPath || compilation.options.output.publicPath, () => {
          if (that.options.inject) {
            const tags = generateAppleTags(that.options, that.assets)
            const themeColorTag = {
              name: 'theme-color',
              content: that.options['theme-color'] || that.options.theme_color
            }
            if (themeColorTag.content) applyTag(tags, 'meta', themeColorTag)
            applyTag(tags, 'link', {
              rel: 'manifest',
              href: that.options.filename
            })
            htmlPluginData.html = htmlPluginData.html.replace(/(<\/head>)/i, `${generateHtmlTags(tags)}</head>`)
          }
          callback(null, htmlPluginData)
        })
      })
    })
    compiler.plugin('emit', (compilation, callback) => {
      if (that.htmlPlugin) {
        injectResources(compilation, that.assets, callback)
      } else {
        buildResources(that, that.options.publicPath || compilation.options.output.publicPath, () => {
          injectResources(compilation, that.assets, callback)
        })
      }
    })
  }
}

module.exports = WebpackPwaManifest
