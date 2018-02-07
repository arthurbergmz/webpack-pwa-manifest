export default function (template, formatters) {
  return formatters && Array.isArray(formatters)
    ? formatters.reduce((previous, { placeholder, value }) => {
      const replace = typeof value === 'function' ? value(placeholder) : value
      return previous.replace(`[${placeholder}]`, replace)
    }, template)
  : template
}
