export default function (...arr) {
  return arr.join('/').replace(/([^:\s\%\3\A])\/+/g, '$1/')
}
