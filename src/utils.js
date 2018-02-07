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
