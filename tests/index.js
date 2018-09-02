const runTest = require('./runTest')
const tests = ['basic', 'complex', 'fingerprints-false', 'rgb-background', 'rgba-background']

console.log('Running tests...')
runTest(tests.shift(), tests)
