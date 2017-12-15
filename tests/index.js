const runTest = require('./runTest')
const tests = ['basic', 'complex']

console.log('Running tests...')
runTest(tests.shift(), tests)
