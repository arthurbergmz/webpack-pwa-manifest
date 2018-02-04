export function beforeHtmlProcessing (manifestOptions, pluginOptions) {
  return (htmlPluginData, callback) => {
    if (!htmlPlugin) htmlPlugin = true
    buildResources(that, publicPath, () => {
      if (that.options.inject) {
        const tags = generateAppleTags(that.options, assets)
        const themeColorTag = {
          name: 'theme-color',
          content: manifestOptions['theme-color'] || manifestOptions.theme_color
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
  }
}

export function emit (config, { publicPath: pluginPublicPath }) {
  return (compilation, callback) => {
    if (config.htmlPlugin) {
      injectResources(compilation, config.assets, callback)
    } else {
      const publicPath = pluginPublicPath || compilation.options.output.publicPath
      buildResources(that, publicPath, () => {
        injectResources(compilation, config.assets, callback)
      })
    }
  }
}
