const runTest = require('./runTest')
const tests = ['basic', 'complex', 'fingerprints-false', 'fingerprints-icons', 'fingerprints-manifest', 'rgb-background', 'rgba-background']

console.log('Running tests...')
runTest(tests.shift(), tests)
