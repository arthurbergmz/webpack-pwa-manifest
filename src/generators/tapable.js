import { buildResources, injectResources, generateHtmlTags, generateAppleTags, generateMaskIconLink, applyTag } from '../injector'
let HtmlWebpackPlugin;
try {
  HtmlWebpackPlugin = require('html-webpack-plugin');
} catch (e) {
  if (process.env.NODE_ENV === 'development') {
    console.log('it seems like you are not using html-webpack-plugin');
  }
} finally {}

function getBeforeProcessingHook(compilation) {
  if (!compilation.hooks || !compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
    return (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) ? HtmlWebpackPlugin.getHooks(compilation).beforeEmit : null;
  }
  return compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing;
}

module.exports = function (that, { hooks: { compilation: comp, emit } }) {
  comp.tap('webpack-pwa-manifest', (compilation) => {
    const beforeProcessingHook = getBeforeProcessingHook(compilation);
    if (!beforeProcessingHook) return;
    beforeProcessingHook.tapAsync('webpack-pwa-manifest', function(htmlPluginData, callback) {
      if (!that.htmlPlugin) that.htmlPlugin = true
      const publicPath = compilation.mainTemplate.getAssetPath(
        that.options.publicPath || compilation.options.output.publicPath,
        { hash: compilation.hash }
      );
      buildResources(that, publicPath, () => {
        if (that.options.inject) {
          let tags = generateAppleTags(that.options, that.assets)
          const themeColorTag = {
            name: 'theme-color',
            content: that.options['theme-color'] || that.options.theme_color
          }
          if (themeColorTag.content) applyTag(tags, 'meta', themeColorTag)
          applyTag(tags, 'link', Object.assign({
            rel: 'manifest',
            href: that.manifest.url
          }, !!that.options.crossorigin && { crossorigin: that.options.crossorigin }))
          tags = generateMaskIconLink(tags, that.assets)
          htmlPluginData.html = htmlPluginData.html.replace(/(<\/head>)/i, `${generateHtmlTags(tags)}</head>`)
        }
        callback(null, htmlPluginData)
      })
    })
  })
  emit.tapAsync('webpack-pwa-manifest', (compilation, callback) => {
    if (that.htmlPlugin) {
      injectResources(compilation, that.assets, callback)
    } else {
      const publicPath = compilation.mainTemplate.getAssetPath(
        that.options.publicPath || compilation.options.output.publicPath,
        { hash: compilation.hash }
      );
      buildResources(that, publicPath, () => {
        injectResources(compilation, that.assets, callback)
      })
    }
  })
}
