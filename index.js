const cssColorNames = require('css-color-names')
const jimp = require('jimp')
const mime = require('mime')

function WebpackPwaManifest (options) {
  const hasPreset = (key, value) => this.presets[key].indexOf(value) >= 0
  const presetError = (m, n) => new Error(`Unknown value of ${m}: ${n}`)
  const validateCssColor = color => (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/).test(color) || (typeof color === 'string' && cssColorNames[color])
  const checkPresets = () => {
    for (let arg of arguments) {
      let option = options[arg]
      if (option && !hasPreset(arg, option)) throw presetError(arg, option)
    }
  }
  const checkIcons = obj => {
    if (!obj) return
    const icons = obj.icon || obj.icons
    let response = []
    if (Array.isArray(icons)) {
      for (let icon of icons) response.push(validateIconInformation(icon.src, icon.size || icon.sizes))
    } else {
      response.push(validateIconInformation(icons.src, icons.size || icons.sizes))
    }
    obj.icons = response
  }
  const validateIconInformation = (src, n) => {
    if (!src) throw new Error('Unknown source of icon image.')
    if (!n) throw new Error('Unknown icon size declaration.')
    if (!Array.isArray(n)) n = [n]
    let sizes = []
    for (let i of n) {
      i = typeof i === 'number' ? i : (typeof i === 'string' ? parseInt(i.toLowerCase().split('x', 1)[0]) : parseInt(i))
      sizes.push(i)
    }
    return {
      src,
      sizes
    }
  }
  this.presets = {
    dir: ['ltr', 'rtl', 'auto'],
    orientation: [
      'any', 'natural', 'landscape', 'landscape-primary',
      'landscape-secondary', 'portrait', 'portrait-primary',
      'portrait-secondary'
    ],
    display: [
      'fullscreen', 'standalone', 'minimal-ui', 'browser'
    ]
  }
  options = options || {}
  checkIcons(options)
  this.config = Object.assign({
    filename: 'manifest.json',
    name: 'App',
    orientation: 'portrait',
    display: 'standalone',
    start_url: '.'
  }, options)
  checkPresets('dir', 'display', 'orientation')
  if (!this.config.short_name) this.config.short_name = this.config.name
  if (this.config.background_color && !validateCssColor(this.config.background_color)) throw presetError('background_color', this.config.background_color)
  if (this.config.theme_color && !validateCssColor(this.config.theme_color)) throw presetError('theme_color', this.config.theme_color)
}

WebpackPwaManifest.prototype.generateIcons = function (compilation, callback) {
  const iconsCache = this.config.icons
  this.config.icons = []
  const self = this
  const processIcon = (icon, icons) => {
    processResize(icon.sizes.pop(), icon, icons)
  }
  const processResize = (size, icon, icons) => {
    let type = mime.lookup(icon.src)
    let extension = mime.extension(type)
    let filename = `icon_${size}x${size}.${extension}`
    self.config.icons.push({
      src: filename,
      sizes: `${size}x${size}`,
      type
    })
    jimp.read(icon.src, (err, image) => {
      if (err) throw new Error(`It was not possible to read ${icon.src}.`)
      image.resize(size, size).getBuffer(type, (err, buffer) => {
        if (err) throw new Error(`It was not possible to retrieve buffer of ${icon.src}`)
        compilation.assets[filename] = {
          source: () => buffer,
          size: () => buffer.length
        }
        if (icon.sizes.length) {
          processResize(icon.sizes.pop(), icon, icons) // next size
        } else if (icons.length) {
          processIcon(icons.pop(), icons) // next icon
        } else {
          callback() // there are no more icons left
        }
      })
    })
  }
  if (iconsCache.length) {
    processIcon(iconsCache.pop(), iconsCache)
  } else {
    callback()
  }
}

WebpackPwaManifest.prototype.generateManifest = function (compilation) {
  const content = Object.assign({}, this.config)
  delete content.filename
  const json = JSON.stringify(content, null, 2)
  compilation.assets[this.config.filename] = {
    source: () => json,
    size: () => json.length
  }
}

WebpackPwaManifest.prototype.apply = function (compiler) {
  const self = this
  compiler.plugin('emit', (compilation, callback) => {
    if (self.config.icons) {
      self.generateIcons(compilation, () => {
        self.generateManifest(compilation)
        callback()
      })
    } else {
      self.generateManifest(compilation)
      callback()
    }
  })
}

module.exports = WebpackPwaManifest
