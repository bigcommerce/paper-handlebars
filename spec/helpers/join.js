const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('join helper', function() {
    const context = {
        list: ['Mario', 'Chris', 'Mick', 'Hau', 'Cody']
    };

    const runTestCases = testRunner({context});

    it('should print a list of names', function(done) {
        runTestCases([
            {
                input: '{{join list " "}}',
                output: 'Mario Chris Mick Hau Cody',
            },
            {
                input: '{{join list ", "}}',
                output: 'Mario, Chris, Mick, Hau, Cody',
            },
        ], done);
    });

    it('should print a list of names and limit to 3', function(done) {
        runTestCases([
            {
                input: '{{join list " " limit=3}}',
                output: 'Mario Chris Mick',
            },
        ], done);
    });

    it('should print a list of names and use "and" for the last name', function(done) {
        runTestCases([
            {
                input: '{{join list ", " lastSeparator=" and "}}',
                output: 'Mario, Chris, Mick, Hau and Cody',
            },
        ], done);
    });

    it('should print a list of names and limit to 3 and use "and" for the last name', function(done) {
        runTestCases([
            {
                input: '{{join list ", " limit=3 lastSeparator=" and "}}',
                output: 'Mario, Chris and Mick',
            },
        ], done);
    });
});
