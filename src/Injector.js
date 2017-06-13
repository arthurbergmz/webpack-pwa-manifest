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
  callback({
    file: options.fingerprints ? `${filename.name}.${generateFingerprint(json)}${filename.ext}` : `${filename.name}${filename.ext}`,
    source: json,
    size: json.length
  })
}

export default function (_this, htmlPluginData, callback) {
  if (_this.assets && _this.options.inject) {
    callback()
  } else {
    parseIcons(_this.options.fingerprints, retrieveIcons(_this.options), (result) => {
      manifest(_this.options, result.icons, (manifest) => {
        _this.options.filename = manifest.file
        _this.assets = [manifest, ...(result.assets || [])]
        callback()
      })
    })
  }
}
