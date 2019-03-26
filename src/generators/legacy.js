import { buildUtils } from '../utils'
import { beforeHtmlProcessing, emit } from './common'

module.exports = function (pluginConfig) {
  const config = {
    assets: null,
    htmlPlugin: false
  }
  return (compiler) => {
    compiler.plugin('compilation', (compilation) => {
      const publicPath = pluginConfig.output.publicPath || compilation.options.output.publicPath
      compilation.plugin('html-webpack-plugin-before-html-processing', beforeHtmlProcessing(config, buildUtils(publicPath, pluginConfig)))
    })
    compiler.plugin('emit', emit(config, pluginConfig))
  }
}
