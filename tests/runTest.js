const webpack = require('webpack')
const path = require('path')
const ls = require('list-directory-contents')
const fs = require('fs')

function run (name, next) {
  if (!name) return console.log('End.')
  const config = require(path.resolve(`./tests/${name}/build/webpack.config.js`))
  console.log(`"${name}": building...`)
  webpack(config, (err, stats) => {
    if (err) throw err
    console.log(`"${name}": testing...`)
    const testPath = path.join(__dirname, name, 'test')
    const testPathLength = testPath.length
    ls(testPath, (err, tree) => {
      if (err) throw err
      const testTree = tree.filter((i) => /.*\..+/.test(i))
      const testContent = testTree.map((i) => i.substring(testPathLength))
      for (const i of testContent) console.log(i)
      const testContentLength = testContent.length
      const outputPath = path.join(__dirname, name, 'output')
      const outputPathLength = outputPath.length
      ls(outputPath, (err, outputTree) => {
        if (err) throw err
        const outputContent = outputTree.filter((i) => /.*\..+/.test(i))
        const outputContentLength = outputContent.length
        if (testContentLength === outputContentLength) {
          console.log(testContentLength)
          const result = outputContent.reduce((previous, current) => {
            const p = current.substring(outputPathLength)
            const f = testContent.indexOf(p)
            console.log(p)
            console.log(fs.readFileSync(current).equals(fs.readFileSync(testTree[f])))
            return f > -1 && fs.readFileSync(current).equals(fs.readFileSync(testTree[f])) ? previous + 1 : previous
          }, 0)
          console.log(result)
          if (result === testContentLength) {
            console.log(`Test "${name}" passed.`)
            run(next.shift(), next)
          } else {
            console.log('There are files missing or with different content.')
            console.log(`Test "${name}" failed.`)
          }
        } else {
          console.log(`Expected ${testContentLength} file(s).`)
          console.log(`Found ${outputContentLength} file(s).`)
          console.log(`Test "${name}" failed.`)
        }
      })
    })
  })
}

module.exports = run
