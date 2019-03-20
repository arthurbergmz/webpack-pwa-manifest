import parse from './parse'
import manifest from './manifest'

export function beforeHtmlProcessing (config, utils) {
  return (htmlPluginData, callback) => {
    if (!config.htmlPlugin) config.htmlPlugin = true
    parse(utils)
      .then(manifest(utils))
      // .then(customTags(utils))
      // .then(injectCustomTags)
      .then(callback)
  }
}

export function emit (config, pluginPublicPath) {
  return (compilation, callback) => {
    if (config.htmlPlugin) {
      // injectResources(compilation, config.assets, callback)
    } else {
      // const publicPath = pluginPublicPath.publicPath || compilation.options.output.publicPath
      // buildResources(that, publicPath, () => {
      //   injectResources(compilation, config.assets, callback)
      // })
    }
  }
}
