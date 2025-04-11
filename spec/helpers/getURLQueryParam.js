const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    specHelpers = require('../spec-helpers'),
    testRunner = specHelpers.testRunner;


describe('getURLQueryParam helper', function() {
    const context = {
        test_url: 'http://example.com/?test=1&alternative=this_is_a_string',
        not_a_url: null,
        key1: 'test',
        key2: 'alternative',
        value: 'google',
    };

    const runTestCases = testRunner({context});

    it('should return a URL with an added parameter given correct input', function(done) {
        runTestCases([
            {
                input: '{{getURLQueryParam test_url key1}}',
                output: `1`,
            },
            {
                input: '{{getURLQueryParam test_url key2}}',
                output: `this_is_a_string`,
            },
        ], done);
    });
});
