const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('equals helper', function() {
    const context = {
        value: 5
    };

    // Build a test runner
    const runTestCases = testRunner({context});

    it('should render yes if the value is equal to 5', function(done) {
        runTestCases([
            {
                input: '{{#equals 5 value}}yes{{/equals}}',
                output: 'yes',
            },
            {
                input: '{{#equals value 5}}yes{{/equals}}',
                output: 'yes',
            },
        ], done);
    });

    it('should render empty string', function(done) {
        runTestCases([
            {
                input: '{{#equals 6 value}}yes{{/equals}}',
                output: '',
            },
            {
                input: '{{#equals value 6}}yes{{/equals}}',
                output: '',
            },
        ], done);
    });
});
