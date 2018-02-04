// TODO

import { applyTag } from './'

const appleTags = {
  'apple-touch-icon': 'link',
  'apple-touch-startup-image': 'link',
  'apple-mobile-web-app-title': 'meta',
  'apple-mobile-web-app-capable': 'meta',
  'apple-mobile-web-app-status-bar-style': 'meta'
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
