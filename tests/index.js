const runTest = require('./runTest')
const tests = [
    'basic', 
    'complex', 
    'fingerprints-false',
    'issue-84',
    'issue-87', 
    'rgb-background', 
    'rgba-background',
    'issue-59',
    'issue-59-2'
]

console.log('Running tests...')
runTest(tests.shift(), tests)
