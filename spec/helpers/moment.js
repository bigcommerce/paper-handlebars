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
                input: `{{moment "1 year ago" "YYYY"}}`,
                output: `${now.getFullYear() - 1}`,
            },
        ], done);
    });

    it('permits use of moment.js functions', (done) => {
        runTestCases([
            {
                input: `{{moment "2022-01-01" isAfter="1999-12-31"}}`,
                output: `true`,
            }
        ], done);
    });
});