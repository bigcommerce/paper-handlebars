const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    testRunner = require('../spec-helpers').testRunner;

describe('option helper', function () {
    const context = {
        array: [1, 2, 3, 4, 5],
        options: { a: { b: { c: 'd' } } }
    };

    const runTestCases = testRunner({context});

    it('returns the nested prop of this.options', function (done) {
        runTestCases([
            {
                input: `{{option "a.b.c"}}`,
                output: 'd',
            },
        ], done);
    });

    it('does not access prototype props', function (done) {
        context.options.__proto__ = {x: 'yz'};
        runTestCases([
            {
                input: `{{option "x"}}`,
                output: ``,
            },
        ], done);
    });

    it('accepts SafeString paths', (done) => {
        runTestCases([
            {
                input: `{{option (concat 'a.b.' 'c')}}`,
                output: `d`,
            },
        ], done);
    });
});