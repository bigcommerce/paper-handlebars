const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('snippet helper', function() {

    const runTestCases = testRunner({});

    it('should render a comment', function(done) {
        runTestCases([
            {
                input: '{{{snippet "header"}}}',
                output: '<!-- snippet location header -->',
            },
        ], done);
    });
});
