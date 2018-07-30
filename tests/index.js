const runTest = require('./runTest')
const tests = ['basic', 'complex', 'fingerprints-false', 'output-to-directory']

console.log('Running tests...')
runTest(tests.shift(), tests)
