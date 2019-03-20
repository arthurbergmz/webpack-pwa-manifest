import { buildUtils } from '../utils'
import { beforeHtmlProcessing, emit } from './common'

module.exports = function (manifestOptions, pluginOptions) {
  const config = {
    assets: null,
    htmlPlugin: false
  }
  return (compiler) => {
    compiler.plugin('compilation', (compilation) => {
      const publicPath = pluginOptions.publicPath || compilation.options.output.publicPath
      compilation.plugin('html-webpack-plugin-before-html-processing', beforeHtmlProcessing(config, buildUtils(publicPath, pluginOptions, manifestOptions)))
    })
    compiler.plugin('emit', emit(config, pluginOptions))
  }
}
