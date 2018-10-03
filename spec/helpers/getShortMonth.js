const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('getShortMonth helper', function() {

    const runTestCases = testRunner({});

    it('should render an object properly', function(done) {
        runTestCases([
            {
                input: '{{getShortMonth 1}}',
                output: 'Jan',
            },
            {
                input: '{{getShortMonth 2}}',
                output: 'Feb',
            },
            {
                input: '{{getShortMonth 3}}',
                output: 'Mar',
            },
            {
                input: '{{getShortMonth 4}}',
                output: 'Apr',
            },
            {
                input: '{{getShortMonth 5}}',
                output: 'May',
            },
            {
                input: '{{getShortMonth 6}}',
                output: 'Jun',
            },
            {
                input: '{{getShortMonth 7}}',
                output: 'Jul',
            },
            {
                input: '{{getShortMonth 8}}',
                output: 'Aug',
            },
            {
                input: '{{getShortMonth 9}}',
                output: 'Sep',
            },
            {
                input: '{{getShortMonth 10}}',
                output: 'Oct',
            },
            {
                input: '{{getShortMonth 11}}',
                output: 'Nov',
            },
            {
                input: '{{getShortMonth 12}}',
                output: 'Dec',
            },
        ], done);
    });
});
