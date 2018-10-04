const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('json helper', function() {
    const context = {
        object: { a: 1, b: "hello" }
    };

    const runTestCases = testRunner({context});

    it('should render object to json format', function(done) {
        runTestCases([
            {
                input: '{{{json object}}}',
                output: '{"a":1,"b":"hello"}',
            },
        ], done);
    });
});
