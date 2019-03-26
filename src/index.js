import validatePresets from './validators/presets'
import validateColors from './validators/colors'
import validateShortName from './validators/shortName'
import { defaultConfig, buildObjectUponDefault } from './options'

class WebpackPwaManifest {
  constructor (config) {
    this._generator = null
    this.pluginConfig = buildObjectUponDefault(defaultConfig, config)
    validateShortName(this.pluginConfig)
    validatePresets(this.pluginConfig, 'dir', 'display', 'orientation')
    validateColors(this.pluginConfig, 'background_color', 'theme_color')
  }

  _acquireGenerator (hooks) {
    return hooks ? require('./generators/tapable') : require('./generators/legacy')
  }

  apply (compiler) {
    const { hooks } = compiler
    const generator = this._generator || (this._generator = this._acquireGenerator(hooks)(this.pluginConfig))
    generator(compiler)
  }
}

module.exports = WebpackPwaManifest
