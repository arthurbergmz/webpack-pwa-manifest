import { parseRaw, parseResized } from '../../builders/icons'

export default function (publicPath, manifestOptions, pluginOptions) {
  return new Promise((resolve, reject) => {
    const { icons, ...others } = manifestOptions
    parseRaw(icons)
      .then(parseResized(pluginOptions))
      .then((parsedIcons) => resolve({
        icons: parsedIcons,
        ...others
      }))
      .catch(reject)
  })
}
