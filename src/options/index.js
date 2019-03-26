export const defaultConfig = {
  output: {
    publicPath: null,
    injectHtml: true,
    includeDirectory: true,
    manifest: {
      filename: 'manifest.webmanifest',
      destination: '/manifest'
    },
    icons: {
      filename: '[name]_[size].[hash][ext]',
      destination: '/manifest/icons'
    }
  },
  manifest: {
    name: 'App',
    orientation: 'portrait',
    display: 'standalone',
    start_url: '.'
  }
}

export function required (message) {
  throw new Error(message)
}

export function buildObjectUponDefault (defaultObject, customObject) {
  const keys = Object.getOwnPropertyNames(customObject)
  return keys.reduce((obj, key) => {
    const property = obj[key]
    if (typeof property === 'object' && typeof property !== null) {
      obj[key] = buildObjectUponDefault(property, customObject[key])
    } else {
      obj[key] = customObject[key]
    }
    return obj
  }, Object.assign({}, defaultObject))
}
