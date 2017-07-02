import path from 'path'
import generateFingerprint from './Fingerprint'
import { retrieveIcons, parseIcons } from './Icons'

function manifest (options, icons, callback) {
  const content = Object.assign({ icons }, options)
  delete content.filename
  delete content.inject
  delete content.fingerprints
  const json = JSON.stringify(content, null, 2)
  const filename = path.parse(options.filename)
  callback(null, {
    file: options.fingerprints ? `${filename.name}.${generateFingerprint(json)}${filename.ext}` : `${filename.name}${filename.ext}`,
    source: json,
    size: json.length
  })
}

export default function (_this, htmlPluginData, callback) {
  if (_this.assets && _this.options.inject) {
    callback()
  } else {
    const { publicPath = '' } = htmlPluginData.assets;
    parseIcons(_this.options.fingerprints, publicPath, retrieveIcons(_this.options), (err, result) => {
      if (err) return
      manifest(_this.options, result.icons, (fail, manifest) => {
        if (fail) return
        _this.options.filename = manifest.file
        _this.assets = [manifest, ...(result.assets || [])]
        callback()
      })
    })
  }
}
