const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('occurrences helper', function() {
    const context = {
        string: "asdf asdf2 xxx yyy",
        number: 1,
        object: {
            asdf: 1,
            asdf2: 2,
            xxx: 3,
            yyy: 4,
        },
        array: ['asdf', 'asdf2', 'xxx', 'yyy']
    };

    const runTestCases = testRunner({context});

    it('should count number of occurrences of substring', function(done) {
        runTestCases([
            {
                input: "{{occurrences string 'asdf'}}",
                output: '2',
            },
            {
                input: "{{occurrences string 'xxx'}}",
                output: '1',
            },
            {
                input: "{{occurrences string 'x'}}",
                output: '3',
            },
            {
                input: "{{occurrences string 'zzz'}}",
                output: '0',
            },
        ], done);
    });

    it('should ignore non-strings', function(done) {
        runTestCases([
            {
                input: "{{occurrences object 'asdf'}}",
                output: '0',
            },
            {
                input: "{{occurrences array 'asdf'}}",
                output: '0',
            },
            {
                input: "{{occurrences number '1'}}",
                output: '0',
            },
            {
                input: "{{occurrences string object}}",
                output: '0',
            },
            {
                input: "{{occurrences string array}}",
                output: '0',
            },
            {
                input: "{{occurrences '1' number}}",
                output: '0',
            },
        ], done);
    });

    it('should ignore empty strings', function(done) {
        runTestCases([
            {
                input: "{{occurrences '' 'asdf'}}",
                output: '0',
            },
            {
                input: "{{occurrences string ''}}",
                output: '0',
            },
        ], done);
    });
});
