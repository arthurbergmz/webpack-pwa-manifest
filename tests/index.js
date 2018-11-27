const runTest = require('./runTest')
const tests = ['basic', 'complex', 'fingerprints-false', 'issue-84', 'rgb-background', 'rgba-background']

console.log('Running tests...')
runTest(tests.shift(), tests)
