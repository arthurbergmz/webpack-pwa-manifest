import parse from './parse'
import manifest from './manifest'
import customTags from './customTags'
import { iconBuilder } from '../../builders/index'

export function beforeHtmlProcessing (config, manifestOptions, pluginOptions, publicPath) {
  return (htmlPluginData, callback) => {
    if (!config.htmlPlugin) config.htmlPlugin = true
    parse(publicPath, manifestOptions, pluginOptions)
      // .then(manifest(pluginOptions))
      // .then(customTags(pluginOptions))
      // .then(injectCustomTags)
      .then(callback)
  }
}

export function emit (config, pluginPublicPath) {
  return (compilation, callback) => {
    if (config.htmlPlugin) {
      // injectResources(compilation, config.assets, callback)
    } else {
      const publicPath = pluginPublicPath.publicPath || compilation.options.output.publicPath
      // buildResources(that, publicPath, () => {
      //   injectResources(compilation, config.assets, callback)
      // })
    }
  }
}
