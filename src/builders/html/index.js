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

export function generateHtmlTags (tags) {
  let html = ''
  for (let tag in tags) {
    const attrs = tags[tag]
    if (Array.isArray(attrs)) {
      for (let a of attrs) {
        html = `${html}${generateHtmlTags({ [tag]: a })}`
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
