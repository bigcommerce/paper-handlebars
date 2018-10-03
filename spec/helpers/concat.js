const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('concat helper', function() {
    const context = {
        var1: 'hello',
        var2: 'world',
    };

    // Build a test runner
    const runTestCases = testRunner({context});

    it('should concatanate two strings', function(done) {
        runTestCases([
            {
                input: '{{concat var1 var2}}',
                output: 'helloworld',
            },
        ], done);
    });
});

