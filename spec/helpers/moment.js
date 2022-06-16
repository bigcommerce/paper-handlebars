const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    testRunner = require('../spec-helpers').testRunner;

describe('moment helper', function () {
    const runTestCases = testRunner({});

    it('renders the date in the format specified', function (done) {
        const now = new Date();
        runTestCases([
            {
                input: `{{#moment "1 year ago" "YYYY"}}{{/moment}}`,
                output: `${now.getFullYear() - 1}`,
            },
        ], done);
    });
});