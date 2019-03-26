import { defaultPlugin } from '../options'

const deprecated = {
  useWebpackPublicPath: 'https://github.com/arthurbergmz/webpack-pwa-manifest/issues/12'
}

const deprecatedMessage = (property) => console.log(`"${property}" is a deprecated option. Read more at "${deprecated[property]}".`)

const breakingChangeMessage = (property, options) => {
  const [ key, value ] = property
  console.log(`[webpack-pwa-manifest v5.x.x] Breaking change: "${key}" is a plugin option, not a manifest one. Read more at "url".`)
  options[key] = value
}

export const checkDeprecated = (obj, ...properties) => {
  properties.filter((property) => obj[property]).forEach(deprecatedMessage)
  return obj
}

export const checkBreakingChange = (obj = {}) => {
  const pluginOptions = {}
  Object.keys(obj).filter((property) => defaultPlugin[property]).map((property) => [property, obj[property]]).forEach((property) => breakingChangeMessage(property, pluginOptions))
  return pluginOptions
}
