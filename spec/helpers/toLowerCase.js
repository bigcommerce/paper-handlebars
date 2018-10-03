const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('toLowerCase helper', function() {
    const context = {
        string: "I Love PIZZA",
        number: 365,
        object: {},
        array: [1, 2, 3]
    };

    const runTestCases = testRunner({context});

    it('should convert string to lower case', function(done) {
        runTestCases([
            {
                input: '{{toLowerCase string}}',
                output: 'i love pizza',
            },
            {
                input: '{{toLowerCase "HELLO"}}',
                output: 'hello',
            },
        ], done);
    });

    it('should properly handle values other than strings', function(done) {
         runTestCases([
            {
                input: '{{toLowerCase number}}',
                output: '365',
            },
            {
                input: '{{toLowerCase 5}}',
                output: '5',
            },
            {
                input: '{{toLowerCase object}}',
                output: '[object Object]',
            },
            {
                input: '{{toLowerCase array}}',
                output: '1,2,3',
            },
        ], done);
    });
});
