import { buildResources, injectResources, generateHtmlTags, generateAppleTags, generateMaskIconLink, applyTag } from '../injector'

module.exports = function (that, compiler) {
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
      if (!that.htmlPlugin) that.htmlPlugin = true
      buildResources(that, that.options.publicPath || compilation.options.output.publicPath, () => {
        if (that.options.inject) {
          let tags = generateAppleTags(that.options, that.assets)
          const themeColorTag = {
            name: 'theme-color',
            content: that.options['theme-color'] || that.options.theme_color
          }
          if (themeColorTag.content) applyTag(tags, 'meta', themeColorTag)
          applyTag(tags, 'link', {
            rel: 'manifest',
            href: that.manifest.url
          })
          tags = generateMaskIconLink(tags, that.assets)
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
