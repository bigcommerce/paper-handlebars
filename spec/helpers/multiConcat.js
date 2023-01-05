const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;


describe('multiConcat helper', function() {
    const context = {
        string1: "First",
        string2: "Second",
        string3: "Third"
    };

    const runTestCases = testRunner({context});

    it('should concatenate all strings by default', function(done) {
        runTestCases([
            {
                input: '{{multiConcat string1 string2 string3}}',
                output: 'FirstSecondThird',
            }
        ], done);
    });
});
