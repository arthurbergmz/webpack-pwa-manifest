export const defaultManifest = {
  name: 'App',
  orientation: 'portrait',
  display: 'standalone',
  start_url: '.'
}

export const defaultPlugin = {
  outputFile: 'manifest.json',
  inject: true,
  fingerprints: true,
  ios: false,
  publicPath: null,
  includeDirectory: true
}

export function required (message) {
  throw new Error(message)
}
