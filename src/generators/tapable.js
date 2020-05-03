import {
  buildResources,
  injectResources,
  generateAppleTags,
  generateMaskIconLink,
  applyTag
} from '../injector'

function* createHtmlTagObjectsFromTags (tags) {
  for (const [tagName, nodes] of Object.entries(tags)) {
    for (const attributes of Array.isArray(nodes) ? nodes : [nodes]) {
      yield {
        tagName,
        voidTag: true,
        attributes
      }
    }
  }
}

function injectManifestTags (plugin, compilation, htmlPluginData, callback) {
  if (!plugin.htmlPlugin) plugin.htmlPlugin = true
  buildResources(plugin, plugin.options.publicPath || compilation.options.output.publicPath, () => {
    if (plugin.options.inject) {
      let tags = generateAppleTags(plugin.options, plugin.assets)
      const themeColorTag = {
        name: 'theme-color',
        content: plugin.options['theme-color'] || plugin.options.theme_color
      }
      if (themeColorTag.content) applyTag(tags, 'meta', themeColorTag)
      applyTag(tags, 'link', Object.assign({
        rel: 'manifest',
        href: plugin.manifest.url
      }, !!plugin.options.crossorigin && {crossorigin: plugin.options.crossorigin}))
      tags = generateMaskIconLink(tags, plugin.assets)
      if (Array.isArray(htmlPluginData.head)) {
        // looks like html-webpack-plugin < v4
        htmlPluginData.head.push(...createHtmlTagObjectsFromTags(tags))
      } else {
        htmlPluginData.headTags.push(...createHtmlTagObjectsFromTags(tags))
      }
    }
    callback(null, htmlPluginData)
  })
}

function getHook(compiler, compilation) {
  // Using a local installation of the HtmlWebpackPlugin will return
  // invalid hooks, that can’t be tapped into, because they’re never
  // executed. See https://github.com/jantimon/html-webpack-plugin/issues/1091.
  // We could either make things explicit and let users pass the Plugin into
  // our options or retrieve the plugin from the webpack options.
  const HtmlWebpackPlugin = compiler.options.plugins.find(
    plugin => plugin.constructor.name === 'HtmlWebpackPlugin').constructor

  if (!HtmlWebpackPlugin) {
    if (process.env.NODE_ENV === 'development') {
      console.log('it seems like you are not using html-webpack-plugin')
    }
  }

  return HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks
    ? HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups
    : compilation.hooks.htmlWebpackPluginAlterAssetTags
}

module.exports = function (plugin, compiler) {
  compiler.hooks.compilation.tap('webpack-pwa-manifest', (compilation) => {
    const hook = getHook(compiler, compilation)
    if (!hook) return

    hook.tapAsync(
      'webpack-pwa-manifest',
      (data, callback) => injectManifestTags(plugin, compilation, data, callback)
    )
  })

  compiler.hooks.emit.tapAsync('webpack-pwa-manifest', (compilation, callback) => {
    if (plugin.htmlPlugin) {
      injectResources(compilation, plugin.assets, callback)
    } else {
      buildResources(plugin, plugin.options.publicPath || compilation.options.output.publicPath, () => {
        injectResources(compilation, plugin.assets, callback)
      })
    }
  })
}
