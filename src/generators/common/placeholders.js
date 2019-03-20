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
  availablePlaceholders: ['name', 'size', 'ext', 'hash'],
  generatePlaceholders: function (filePath, size, buffer) {
    const filePlaceholders = this.filePlaceholders(filePath)
    const hashPlaceholder = this.hashPlaceholder(buffer)
    return {
      name: filePlaceholders.fileName,
      size,
      ext: filePlaceholders.fileExtension,
      hash: hashPlaceholder
    }
  }
}

export default _default