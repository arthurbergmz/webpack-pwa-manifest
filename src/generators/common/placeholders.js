import crypto from 'crypto'
import path from 'path'

const _default = {
  hashPlaceholder: function (input) {
    return crypto.createHash('md5').update(input).digest('hex')
  },
  filePlaceholders: function (filePath) {
    const fileExtension = path.extname(filePath)
    const fileName = path.basename(filePath, fileExtension)
    return {
      fileName,
      fileExtension
    }
  },
  generatePlaceholders: function (filePath, size, buffer) {
    const filePlaceholders = this.filePlaceholders(filePath)
    return [
      {
        placeholder: 'name',
        value: filePlaceholders.fileName
      },
      {
        placeholder: 'size',
        value: size
      },
      {
        placeholder: 'ext',
        value: filePlaceholders.fileExtension
      },
      {
        placeholder: 'hash',
        value: () => this.hashPlaceholder(buffer)
      }
    ]
  },
  format: function (template, placeholders) {
    return placeholders && Array.isArray(placeholders)
      ? placeholders.reduce((previous, { placeholder, value }) => {
        const replace = typeof value === 'function' ? value(placeholder) : value
        return previous.replace(`[${placeholder}]`, replace)
      }, template)
    : template
  }
}

export default _default