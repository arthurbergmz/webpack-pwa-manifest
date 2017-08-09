export function joinURI (...arr) {
  const join = arr.join('/')
  return normalizeURI(join[0] === '/' ? join.substring(1) : join)
}

export function normalizeURI (uri) {
  return uri.replace(/(:\/\/)|(\\+|\/{2,})+/g, match => match === '://' ? '://' : '/')
}
