// export function joinURI (...arr) {
//   const first = arr[0] || ''
//   const join = arr.join('/')
//   return normalizeURI(join[0] === '/' && first[0] !== '/' ? join.substring(1) : join)
// }

// export function normalizeURI (uri) {
//   return uri.replace(/(:\/\/)|(\\+|\/{2,})+/g, match => match === '://' ? '://' : '/')
// }


const { join } = require('path')

export function joinURI(...arr) {
  const isDoubleSlash = arr[0] ? arr[0].indexOf('//') === 0 : false
  const joined = join(...arr)
  if (/^(\w+)/.test(joined)) return '/' + joined
  if (isDoubleSlash) return '/' + joined
  return joined.replace(':/', '://')
}