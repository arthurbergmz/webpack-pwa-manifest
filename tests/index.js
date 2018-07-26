const runTest = require('./runTest')
const tests = ['basic', 'complex', 'fingerprints-false']

console.log('Running tests...')
runTest(tests.shift(), tests)
