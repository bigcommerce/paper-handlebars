const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;


describe('multiConcat helper', function() {
    const context = {
        string1: "First",
        string2: "Second",
        string3: "Third",
        string4: "Fourth"
    };

    const runTestCases = testRunner({context});

    it('should concatenate all strings by default', function(done) {
        runTestCases([
            {
                input: '{{multiConcat string1 string2 string3}}',
                output: 'FirstSecondThird',
            },
            {
                input: '{{multiConcat string1 string2 string3 string4}}',
                output: 'FirstSecondThirdFourth',
            }
        ], done);
    });

    it('should accept string, number, boolean, empty', function(done) {
        runTestCases([
            {
                input: '{{multiConcat "First" 2}}',
                output: 'First2',
            },
            {
                input: '{{multiConcat string1 3 "" "4" true}}',
                output: 'First34true',
            },
            {
                input: '{{multiConcat string1 3 false "" "4" true}}',
                output: 'First3false4true',
            }
        ], done);
    });
});
