import { UnexpectedSizeFormat } from './errors'

export function except (obj, property) {
  const { [property]: removed, ...response } = obj
  return response
}

function parseArray (value) {
  return value && !Array.isArray(value) ? [value] : value
}

export function int (value) {
  return +value || parseInt(value)
}

export const uri = {
  normalize: function (uri) {
    return uri.replace(/(:\/\/)|(\\+|\/{2,})+/g, match => (match === '://' || match === '//') ? match : '/')
  },
  join: function (...arr) {
    const first = arr[0] || ''
    const join = arr.join('/')
    return this.normalize(join[0] === '/' && first[0] !== '/' ? join.substring(1) : join)
  }
}

function parseSizesArray (sizes) {
  return sizes.map((size) => {
    const objType = typeof size
    if (objType === 'number') {
      return `${size}x${size}`
    } else if (objType === 'string') {
      const xSplit = size.split('x')
      if (xSplit.length === 1) {
        return `${size}x${size}`
      } else if (xSplit.length === 2) {
        return size
      } else {
        throw new UnexpectedSizeFormat('size', `${size}`)
      }
    }
    throw new UnexpectedSizeFormat('size', `${size} (${objType})`)
  })
}

export function buildUtils (publicPath, pluginConfig) {
  return {
    _config: pluginConfig,
    _publicPath: publicPath,
    resolveWithoutPublicPath: function (...paths) {
      return uri.join(paths)
    },
    resolveWithPublicPath: function (...paths) {
      return uri.join(this._publicPath, ...paths)
    },
    parseIconSizes: function (sizes) {
      const objType = typeof sizes
      if (objType === 'string') {
        const chunks = sizes.split(' ')
        return parseSizes(chunks)
      } else if (objType === 'number') {
        return [`${sizes}x${sizes}`]
      } else if (Array.isArray(sizes)) {
        return parseSizesArray(sizes)
      }
      throw new UnexpectedSizeFormat('sizes', objType)
    }
  }
}