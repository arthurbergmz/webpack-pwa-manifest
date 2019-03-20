
import jimp from 'jimp'

import parseRaw from './parseRaw'

const supportedMimeTypesByJimp = [jimp.MIME_PNG, jimp.MIME_JPEG, jimp.MIME_BMP]

module.exports = {
  parseRaw: parseRaw(supportedMimeTypesByJimp)
}
