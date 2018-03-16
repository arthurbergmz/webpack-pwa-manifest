import { beforeHtmlProcessing, emit } from './common'

module.exports = function (manifestOptions, pluginOptions) {
  const config = {
    assets: null,
    htmlPlugin: false
  }
  return ({ hooks }) => {
    hooks.compilation.tap('webpack-pwa-manifest', (compilation) => {
      const { htmlWebpackPluginBeforeHtmlProcessing } = compilation.hooks
      if (!htmlWebpackPluginBeforeHtmlProcessing) return
      const publicPath = pluginOptions.publicPath || compilation.options.output.publicPath
      htmlWebpackPluginBeforeHtmlProcessing.tapAsync('webpack-pwa-manifest', beforeHtmlProcessing(config, manifestOptions, pluginOptions, publicPath))
    })
    hooks.emit.tapAsync('webpack-pwa-manifest', emit(config, pluginOptions))
  }
}
