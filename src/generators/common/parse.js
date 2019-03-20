import { parseRaw, parseResized } from '../../builders/icons'

export default function (utils) {
  return new Promise((resolve, reject) => {
    console.log('utils: ', utils)
    const { icons, ...others } = utils._options.manifest
    parseRaw(utils, icons)
      .then(parseResized(utils))
      .then((parsedIcons) => resolve({
        icons: parsedIcons,
        ...others
      }))
      .catch(reject)
  })
}
