import path from 'path'
import generateFingerprint from './Fingerprint'
import { joinURI, normalizeURI } from './URI'
import { retrieveIcons, parseIcons } from './Icons'

function manifest (options, publicPath, icons, callback) {
  const content = Object.assign({ icons }, options)
  delete content.filename
  delete content.inject
  delete content.fingerprints
  const json = JSON.stringify(content, null, 2)
  const filename = path.parse(options.filename)
  const output = options.fingerprints ? `${filename.name}.${generateFingerprint(json)}${filename.ext}` : `${filename.name}${filename.ext}`
  callback(null, {
    output,
    file: joinURI(publicPath, output),
    source: json,
    size: json.length
  })
}

export function buildResources (_this, publicPath, callback) {
  if (_this.assets && _this.options.inject) { // already cached and ready to inject
    callback()
  } else {
    publicPath = publicPath || ''
    parseIcons(_this.options.fingerprints, publicPath, retrieveIcons(_this.options), (err, result) => {
      if (err) return
      manifest(_this.options, publicPath, result.icons, (fail, manifest) => {
        if (fail) return
        _this.options.filename = manifest.file
        _this.assets = [manifest, ...(result.assets || [])]
        callback()
      })
    })
  }
}

export function injectResources (compilation, assets, callback) {
  if (assets) {
    for (let asset of assets) {
      compilation.assets[asset.output] = {
        source: () => asset.source,
        size: () => asset.size
      }
    }
  }
  callback()
}
