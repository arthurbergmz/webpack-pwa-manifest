export default function (config) {
  if (!config) return
  const manifestObject = config.manifest || (config.manifest = { short_name: 'App' })
  manifestObject.short_name = manifestObject.short_name || manifestObject.name || 'App'
  if (manifestObject.short_name.length > 12) {
    // https://developer.chrome.com/apps/manifest/name#short_name
    console.log(`[webpack-pwa-manifest] Short name on manifest exceeds recommended 12 characters: "${manifestObject.short_name}"`)
  }
}