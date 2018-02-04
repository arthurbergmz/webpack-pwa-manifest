import { beforeHtmlProcessing, emit } from './common'

export default function (manifestOptions, pluginOptions) {
  const config = {
    assets: null,
    htmlPlugin: false
  }
  return ({ hooks }) => {
    hooks.compilation.tap('webpack-pwa-manifest', (compilation) => {
      const publicPath = pluginOptions.publicPath || compilation.options.output.publicPath
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('webpack-pwa-manifest', beforeHtmlProcessing(config, manifestOptions, pluginOptions, publicPath))
    })
    hooks.emit.tapAsync('webpack-pwa-manifest', emit(config, pluginOptions))
  }
}
