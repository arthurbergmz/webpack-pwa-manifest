// @ts-ignore
import cssColorNames from 'css-color-names'
import PresetError from './errors/PresetError'

function isHexColor (color) {
  return (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/).test(color)
}

function isCssColor (color) {
  return typeof color === 'string' && cssColorNames[color]
}

export default function (config, ...properties) {
  if (!config) return
  for (let property of properties) {
    let color = config[property]
    if (color && !(isHexColor(color) || isCssColor(color))) throw new PresetError(property, color)
  }
}
