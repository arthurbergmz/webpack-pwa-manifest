export const defaultManifest = {
  name: 'App',
  orientation: 'portrait',
  display: 'standalone',
  start_url: '.'
}

export const defaultPlugin = {
  outputFile: 'manifest.[hash].json',
  iconFile: 'icon_[size].[hash][ext]',
  inject: true,
  publicPath: null,
  includeDirectory: true
}

export function required (message) {
  throw new Error(message)
}
