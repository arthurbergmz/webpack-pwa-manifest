export function joinURI (...arr) {
  return normalizeURI(arr.join('/'))
}

export function normalizeURI (uri) {
  return uri.replace(/(:\/\/)|(\\+|\/{2,})+/g, match => match === '://' ? '://' : '/')
}
