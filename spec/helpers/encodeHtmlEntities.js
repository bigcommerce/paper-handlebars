const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner;

describe('setURLQueryParam helper', function() {
    const context = {
        string: 'foo © bar ≠ baz 𝌆 qux',
    };

    const runTestCases = testRunner({context});

    it('should return a string with HTML entities encoded', function(done) {
        runTestCases([
            {
                input: '{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux"}}',
                output: `foo &#xA9; bar &#x2260; baz &#x1D306; qux`,
            },
            {
                input: '{{encodeHtmlEntities string}}',
                output: `foo &#xA9; bar &#x2260; baz &#x1D306; qux`,
            },
            {
                input: '{{encodeHtmlEntities "string"}}',
                output: `string`,
            },
        ], done);
    });
});
