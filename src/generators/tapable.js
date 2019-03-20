import HtmlWebpackPlugin from 'html-webpack-plugin'

import { buildUtils } from '../utils'
import { beforeHtmlProcessing, emit } from './common'

module.exports = function (manifestOptions, pluginOptions) {
  const config = {
    assets: null,
    htmlPlugin: false
  }
  return ({ hooks }) => {
    hooks.compilation.tap('webpack-pwa-manifest', (compilation) => {
      if (!compilation.hooks ||
        (!compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing &&
          !HtmlWebpackPlugin.getHooks(compilation).beforeEmit)) {
        return
      }
      const publicPath = pluginOptions.publicPath || compilation.options.output.publicPath
      const htmlWebpackPluginBeforeHtmlProcessing = compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing || HtmlWebpackPlugin.getHooks(compilation).beforeEmit
      htmlWebpackPluginBeforeHtmlProcessing.tapAsync('webpack-pwa-manifest', beforeHtmlProcessing(config, buildUtils(publicPath, pluginOptions, manifestOptions)))
    })
    hooks.emit.tapAsync('webpack-pwa-manifest', emit(config, pluginOptions))
  }
}
