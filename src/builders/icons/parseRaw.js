import fs from 'fs'
import jimp from 'jimp'
import mime from 'mime'

import { IconError } from '../../errors';
import placeholders from '../../generators/common/placeholders'

function computePlaceholdersAndBundle(iconElement, currentSize, buffer) {
  const { sizes: removedRawSizes, ..._raw } = iconElement
  return {
    _raw,
    _computed: {
      sizes: currentSize,
      buffer,
      placeholders: placeholders.generatePlaceholders(_raw.src, currentSize, buffer)
    }
  }
}

module.exports = function (supportedMimeTypesByJimp) {
  return function (utils, icons) {
    console.log('icons: ', icons)
    return new Promise((resolve, reject) => {
      const response = []
      const iconAmount = icons.length
      let iconCounter = 0
      ;(function processNext () {
        if (iconCounter++ === iconAmount) {
          return resolve(response)
        }
        const iconElement = icons.pop()
        const mimeType = mime.getType(iconElement.src)
        let sizeCounter = 0
        console.log('next to bundle: ', iconElement)
        const sizes = utils.parseIconSizes(iconElement.sizes)
        const sizesAmount = sizes.length
        ;(function processNextSize () {
          if (sizeCounter++ === sizesAmount) {
            return processNext()
          }
          const currentSize = sizes.pop()
          if (!supportedMimeTypesByJimp.includes(mimeType)) { // Still tries to offer support, maybe it is an SVG icon
            return fs.readFile(iconElement.src, (err, buffer) => {
              if (err) {
                return reject(new IconError(`It was not possible to read '${iconElement.src}'.`))
              }
              response.push(computePlaceholdersAndBundle(iconElement, currentSize, buffer))
              processNextSize()
            })
          }
          jimp.read(iconElement.src, (err, img) => {
            if (err) {
              return reject(new IconError(`It was not possible to read '${iconElement.src}'.`))
            }
            const sizeSplit = currentSize.split('x', 2)
            const resizes = [+sizeSplit[0], +sizeSplit[(sizeSplit.length > 1 ? 1 : 0)]]
            img.resize(resizes[0], resizes[1]).getBuffer(mimeType, (err, buffer) => {
              if (err) {
                return reject(new IconError(`It was not possible to resize '${iconElement.src}'.`))
              }
              response.push(computePlaceholdersAndBundle(iconElement, currentSize, buffer))
              processNextSize()
            })
          })
        })()
      })()
    })
  }
}
