import validatePresets from './validators/presets'
import validateColors from './validators/colors'
import checkDeprecated from './validators/versioning'

class WebpackPwaManifest {
  constructor (options = {}) {
    validatePresets(options, 'dir', 'display', 'orientation', 'crossorigin')
    validateColors(options, 'background_color', 'theme_color')
    checkDeprecated(options, 'useWebpackPublicPath')
    this._generator = null
    this.assets = null
    this.htmlPlugin = false
    const shortName = options.short_name || options.name || 'App'
    this.options = Object.assign({
      filename: '[name].[hash][ext]',
      name: 'App',
      short_name: shortName,
      orientation: 'portrait',
      display: 'standalone',
      start_url: '.',
      inject: true,
      fingerprints: true,
      ios: false,
      publicPath: null,
      includeDirectory: true,
      crossorigin: null
    }, options)
  }

  _acquireGenerator (hooks) {
    return hooks ? require('./generators/tapable') : require('./generators/legacy')
  }

  apply (compiler) {
    const { hooks } = compiler
    const generator = this._generator || (this._generator = this._acquireGenerator(hooks))
    generator(this, compiler)
  }
}

module.exports = WebpackPwaManifest
