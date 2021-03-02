const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('inject helper', function() {
    const context = {
        value1: "Big",
        value2: "Commerce",
    };

    const runTestCases = testRunner({context});

    it('should inject variables', function(done) {
        runTestCases([
            {
                input: "{{inject 'data1' value1}}{{inject 'data2' value2}}{{jsContext}}",
                output: '"{\\"data1\\":\\"Big\\",\\"data2\\":\\"Commerce\\"}"',
            },
        ], done);
    });
});
