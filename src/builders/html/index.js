// TODO

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

export function addTag (obj, tag, content) {
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

export function parseTags (tags) {
  return Object.keys(tags).reduce((html, tag) => {
    const attrs = tags[tag]
    if (Array.isArray(attrs)) {
      return attrs.reduce((previousHtml, attr) => `${previousHtml}${parseTags({ [tag]: attr })}`, html)
    } else {
      const attributes = Object.keys(attrs).reduce((previousAttributes, attr) => `${previousAttributes} ${attr}="${attrs[attr]}"`, '')
      const closing = voidTags.indexOf(tag) === -1 ? `></${tag}` : ' /'
      return `${html}<${tag}${attributes}${closing}>`
    }
  }, '')
}
