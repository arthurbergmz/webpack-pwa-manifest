export class IconError extends Error {
  constructor (msg) {
    super(msg)
    this.name = this.constructor.name
  }
}

export class PresetError extends Error {
  constructor (key, value) {
    super(`Unknown value of "${key}": ${value}`)
    this.name = this.constructor.name
  }
}

export class UnexpectedSizeFormat extends Error {
  constructor (key, value) {
    super(`Unknown type of "${key}": ${value}`)
    this.name = this.constructor.name
  }
}