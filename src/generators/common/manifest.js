export default function (utils) {
  return (parsed) => new Promise((resolve, reject) => {
    for (const obj of parsed) {
      console.log(obj._computed.placeholders)
    }
    console.log('parsed by parseRaw: ', parsed)
  })
}
