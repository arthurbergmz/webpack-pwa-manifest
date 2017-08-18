import jimp from 'jimp'
import mime from 'mime'
import { joinURI } from './URI'
import generateFingerprint from './Fingerprint'
import IconError from './errors/IconError'

function parseArray (i) {
  return i && !Array.isArray(i) ? [i] : i
}

function sanitizeIcon (iconSnippet) {
  if (!iconSnippet.src) throw new IconError('Unknown icon source.')
  const arr = parseArray(iconSnippet.size || iconSnippet.sizes)
  if (!arr) throw new IconError('Unknown icon sizes.')
  const sizes = []
  for (let size of arr) sizes.push(+size || parseInt(size))
  return {
    src: iconSnippet.src,
    sizes,
    destination: iconSnippet.destination,
    ios: iconSnippet.ios || false
  }
}

function process (sizes, icon, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback) {
  const size = sizes.pop()
  if (size > 0) {
    const type = mime.lookup(icon.src)
    jimp.read(icon.src, (err, img) => {
      if (err) throw new IconError(`It was not possible to read '${icon.src}'.`)
      img.resize(size, size).getBuffer(type, (err, buffer) => {
        if (err) throw new IconError(`It was not possible to retrieve buffer of '${icon.src}'.`)
        const sizeFormat = `${size}x${size}`
        const filename = fingerprint ? `icon_${sizeFormat}.${generateFingerprint(buffer)}.${mime.extension(type)}` : `icon_${sizeFormat}.${mime.extension(type)}`
        const output = icon.destination ? joinURI(icon.destination, filename) : filename
        const outputSource = joinURI(publicPath, output)
        icons.push({
          src: outputSource,
          sizes: sizeFormat,
          type
        })
        assets.push({
          output,
          source: buffer,
          size: buffer.length,
          ios: icon.ios ? {
            valid: icon.ios,
            size: sizeFormat,
            href: outputSource
          } : false
        })
        if (sizes.length > 0) {
          process(sizes, icon, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback) // next size
        } else if (cachedIconsCopy.length > 0) {
          const next = cachedIconsCopy.pop()
          process(next.sizes, next, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback) // next icon
        } else {
          callback(null, { icons, assets }) // there are no more icons left
        }
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
