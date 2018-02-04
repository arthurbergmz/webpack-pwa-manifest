import validatePresets from './validators/presets'
import validateColors from './validators/colors'
import { checkDeprecated, checkBreakingChange } from './validators/versioning'
import { defaultManifest, defaultPlugin } from './options'

class WebpackPwaManifest {
  constructor (manifestOptions = {}, pluginOptions = {}) {
    this._generator = null
    this.pluginOptions = checkDeprecated(Object.assign({}, defaultPlugin, checkBreakingChange(manifestOptions), pluginOptions), 'useWebpackPublicPath')
    validatePresets(manifestOptions, 'dir', 'display', 'orientation')
    validateColors(manifestOptions, 'background_color', 'theme_color')
    this.manifestOptions = Object.assign({ short_name: manifestOptions.short_name || manifestOptions.name || 'App' }, defaultManifest, manifestOptions)
  }

  _acquireGenerator (hooks) {
    return hooks ? require('./generators/tapable') : require('./generators/legacy')
  }

  apply (compiler) {
    const { hooks } = compiler
    const generator = this._generator || (this._generator = this._acquireGenerator(hooks)(this.manifestOptions, this.pluginOptions))
    generator(compiler)
  }
}

module.exports = WebpackPwaManifest
