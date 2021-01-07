const webpack = require('webpack')
const path = require('path')
const ls = require('list-directory-contents')
const fs = require('fs')
const assert = require('assert')

function run(name, next) {
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
      const testContentLength = testContent.length
      const outputPath = path.join(__dirname, name, 'output')
      const outputPathLength = outputPath.length

      console.log('testContent: ', testContent)
      console.log('testContentLength: ', testContentLength)

      ls(outputPath, (err, outputTree) => {
        if (err) throw err

        const outputContent = outputTree.filter((i) => /.*\..+/.test(i))
        const outputContentLength = outputContent.length

        // console.log('outputContent: ', outputContent)
        // console.log('outputContentLength: ', outputContentLength)

        if (testContentLength === outputContentLength) {
          const result = outputContent.reduce((successfulTests, outputToTest) => {
            const outputFilename = outputToTest.substring(outputPathLength)
            const testAgainst = testContent.indexOf(outputFilename)

            const isDirectory = fs.lstatSync(outputToTest).isDirectory()
            const success = isDirectory || (testAgainst > -1 && fs.readFileSync(outputToTest).equals(fs.readFileSync(testTree[testAgainst])))

            if (!success) {
              console.log(`FAILED: "${outputFilename}" AGAINST "${testTree[testAgainst]}..."`)
            }

            return success ? successfulTests + 1 : successfulTests
          }, 0)

          // console.log('RESULT: ', result)
          // console.log('TEST CONTENT LENGTH: ', testContentLength)

          if (result === testContentLength) {
            console.log(`Test "${name}" passed.`)
            run(next.shift(), next)
          } else {
            console.log('There are files missing or with different content.')
            console.log(`Test "${name}" failed on file ${outputContent}.`)
            assert(result === testContentLength)
          }
        } else {

          console.log(`Expected ${testContentLength} file(s).`)
          console.log(`Found ${outputContentLength} file(s).`)
          console.log(`Test "${name}" failed.`)
          assert(testContentLength === outputContentLength)
        }
      })
    })
  })
}

module.exports = run
