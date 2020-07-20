import fs from 'fs'
import jimp from 'jimp'
import mime from 'mime'
import { joinURI } from '../helpers/uri'
import generateFingerprint from '../helpers/fingerprint'
import IconError from '../errors/IconError'

const supportedMimeTypes = [jimp.MIME_PNG, jimp.MIME_JPEG, jimp.MIME_BMP]

function parseArray (i) {
  return i && !Array.isArray(i) ? [i] : i
}

function sanitizeIcon (iconSnippet) {
  if (!iconSnippet.src) throw new IconError('Unknown icon source.')
  const arr = parseArray(iconSnippet.size || iconSnippet.sizes)
  if (!arr) throw new IconError('Unknown icon sizes.')
  const sizes = []

  for (let size of arr) {
    typeof arr[0] === 'number' ? sizes.push(+size || parseInt(size)) : sizes.push(size)
  }

  return {
    src: iconSnippet.src,
    sizes,
    destination: iconSnippet.destination,
    ios: iconSnippet.ios || false,
    color: iconSnippet.color,
    purpose: iconSnippet.purpose
  }
}

function processIcon (currentSize, icon, buffer, mimeType, publicPath, shouldFingerprint) {
  const dimensions = typeof currentSize === 'number' ? `${currentSize}x${currentSize}` : currentSize

  if (dimensions.split('x').length === 0) {
    throw new IconError(`Unexpected size format: ${currentSize}. Must be a number or string "WxH"'`)
  }

  const fileName = shouldFingerprint ? `icon_${dimensions}.${generateFingerprint(buffer)}.${mime.getExtension(mimeType)}` : `icon_${dimensions}.${mime.getExtension(mimeType)}`
  const iconOutputDir = icon.destination ? joinURI(icon.destination, fileName) : fileName
  const iconPublicUrl = joinURI(publicPath, iconOutputDir)
  return {
    manifestIcon: {
      src: iconPublicUrl,
      sizes: dimensions,
      type: mimeType,
      purpose: icon.purpose
    },
    webpackAsset: {
      output: iconOutputDir,
      url: iconPublicUrl,
      source: buffer,
      size: buffer.length,
      ios: icon.ios ? { valid: icon.ios, size: dimensions, href: iconPublicUrl } : false,
      color: icon.color
    }
  }
}

function process (sizes, icon, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback) {
  const processNext = function () {
    if (sizes.length > 0) {
      return process(sizes, icon, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback) // next size
    } else if (cachedIconsCopy.length > 0) {
      const next = cachedIconsCopy.pop()
      return process(next.sizes, next, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback) // next icon
    } else {
      return callback(null, { icons, assets }) // there are no more icons left
    }
  }

  const size = sizes.pop()
  if (size > 0 || typeof size === 'string') {
    const mimeType = mime.getType(icon.src)
    if (!supportedMimeTypes.includes(mimeType)) {
      let buffer
      try {
        buffer = fs.readFileSync(icon.src)
      } catch (err) {
        throw new IconError(`It was not possible to read '${icon.src}'.`)
      }
      const processedIcon = processIcon(size, icon, buffer, mimeType, publicPath, fingerprint)
      icons.push(processedIcon.manifestIcon)
      assets.push(processedIcon.webpackAsset)
      return processNext()
    }

    jimp.read(icon.src, (err, img) => {
      if (err) throw new IconError(`It was not possible to read '${icon.src}'.`)

      let x = size, y = size, tmp

      if (typeof size === 'string'){
        tmp = size.split('x')
        x = Number(tmp[0])
        y = Number(tmp[1])
      }

      img.resize(x, y).getBuffer(mimeType, (err, buffer) => {
        if (err) throw new IconError(`It was not possible to retrieve buffer of '${icon.src}'.`)
        const processedIcon = processIcon(size, icon, buffer, mimeType, publicPath, fingerprint)
        icons.push(processedIcon.manifestIcon)
        assets.push(processedIcon.webpackAsset)
        return processNext()
      })
    })
  }
}

export function retrieveIcons (options) {
  const icons = parseArray(options.icon || options.icons)
  const response = []
  if (icons) for (let icon of icons) response.push(sanitizeIcon(icon))
  delete options.icon
  delete options.icons
  return response
}

export function parseIcons (fingerprint, publicPath, icons, callback) {
  if (icons.length === 0) {
    callback(null, {})
  } else {
    const first = icons.pop()
    process(first.sizes, first, icons, [], [], fingerprint, publicPath, callback)
  }
}
