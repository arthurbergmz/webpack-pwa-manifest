import path from 'path'
import generateFingerprint from '../helpers/fingerprint'
import { joinURI } from '../helpers/uri'
import { retrieveIcons, parseIcons } from '../icons'
import except from '../helpers/except'

const voidTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

const appleTags = {
  'apple-touch-icon': 'link',
  'apple-touch-startup-image': 'link',
  'apple-mobile-web-app-title': 'meta',
  'apple-mobile-web-app-capable': 'meta',
  'apple-mobile-web-app-status-bar-style': 'meta'
}

function manifest (options, publicPath, icons, callback) {
  const content = except(Object.assign({ icons }, options), ['filename', 'inject', 'fingerprints', 'ios', 'publicPath', 'icon', 'useWebpackPublicPath'])
  const json = JSON.stringify(content, null, 2)
  const filename = path.parse(options.filename)
  const output = path.join(
      filename.dir,
      options.fingerprints ? `${filename.name}.${generateFingerprint(json)}${filename.ext}` : `${filename.name}${filename.ext}`
  )
  callback(null, {
    output,
    file: joinURI(publicPath, output),
    source: json,
    size: json.length
  })
}

export function buildResources (_this, publicPath, callback) {
  if (_this.assets && _this.options.inject) { // already cached and ready to inject
    callback()
  } else {
    publicPath = publicPath || ''
    parseIcons(_this.options.fingerprints, publicPath, retrieveIcons(_this.options), (err, result) => {
      if (err) return
      manifest(_this.options, publicPath, result.icons, (fail, manifest) => {
        if (fail) return
        _this.options.filename = manifest.file
        _this.assets = [manifest, ...(result.assets || [])]
        callback()
      })
    })
  }
}

export function injectResources (compilation, assets, callback) {
  if (assets) {
    for (let asset of assets) {
      compilation.assets[asset.output] = {
        source: () => asset.source,
        size: () => asset.size
      }
    }
  }
  callback()
}

export function generateAppleTags (options, assets) {
  let tags = {}
  if (options.ios) {
    let apple = Object.assign({
      'apple-mobile-web-app-title': options.name,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default'
    }, typeof options.ios === 'object' ? options.ios : {})
    for (let tag in apple) {
      const type = appleTags[tag]
      if (!type) continue // not a valid apple tag
      applyTag(tags, type, formatAppleTag(tag, apple[tag]))
    }
    if (assets) {
      for (let asset of assets) {
        if (asset.ios && asset.ios.valid) {
          if (asset.ios.valid === 'startup') {
            applyTag(tags, 'link', {
              rel: 'apple-touch-startup-image',
              href: asset.ios.href
            })
          } else {
            applyTag(tags, 'link', {
              rel: 'apple-touch-icon',
              sizes: asset.ios.size,
              href: asset.ios.href
            })
          }
        }
      }
    }
  }
  return tags
}

function formatAppleTag (tag, content) {
  if (tag === 'apple-touch-icon') {
    if (typeof content === 'string') {
      return {
        rel: tag,
        href: content
      }
    } else {
      let sizes = content.sizes
      sizes = +sizes || parseInt(sizes)
      return isNaN(sizes) ? {
        rel: tag,
        href: content.href
      } : {
        rel: tag,
        sizes,
        href: content.href
      }
    }
  } else if (tag === 'apple-touch-startup-image') {
    return {
      rel: tag,
      href: content
    }
  } else if (tag === 'apple-mobile-web-app-title') {
    return {
      name: tag,
      content
    }
  } else if (tag === 'apple-mobile-web-app-capable') {
    let value = content
    if (typeof content === 'boolean' || typeof content === 'number') value = content ? 'yes' : 'no'
    return {
      name: tag,
      content: value
    }
  } else if (tag === 'apple-mobile-web-app-status-bar-style') {
    return {
      name: tag,
      content
    }
  }
  return null
}

export function applyTag (obj, tag, content) {
  if (!content) return
  if (obj[tag]) {
    if (Array.isArray(obj[tag])) {
      obj[tag].push(content)
    } else {
      obj[tag] = [obj[tag], content]
    }
  } else {
    obj[tag] = content
  }
}

export function generateHtmlTags (tags) {
  let html = ''
  for (let tag in tags) {
    const attrs = tags[tag]
    if (Array.isArray(attrs)) {
      for (let a of attrs) {
        html = `${html}${generateHtmlTags({
          [tag]: a
        })}`
      }
    } else {
      html = `${html}<${tag}`
      for (let attr in attrs) {
        html = `${html} ${attr}="${attrs[attr]}"`
      }
      html = voidTags.indexOf(tag) === -1 ? `${html}></${tag}>` : `${html} />`
    }
  }
  return html
}
