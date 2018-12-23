const runTest = require('./runTest')

const tests = [
    'basic', 
    'complex', 
    'fingerprints-false',
    'fingerprints-icons',
    'fingerprints-manifest',
    'issue-84',
    'issue-87', 
    'rgb-background', 
    'rgba-background'
]

console.log('Running tests...')
runTest(tests.shift(), tests)
