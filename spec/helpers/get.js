const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    testRunner = require('../spec-helpers').testRunner;

describe('get helper', function () {
    const context = {
        array: [1, 2, 3, 4, 5],
        options: { a: { b: { c: 'd' } } },
        aa: 'a',
        ab: 'b',
    };

    const runTestCases = testRunner({ context });

    it('gets a nested prop', (done) => {
        runTestCases([
            {
                input: `{{get "a.b.c" this.options}}`,
                output: `d`,
            }
        ], done);
    });

    it('does not access prototype properties', (done) => {
        context.__proto__ = {x: 'yz'};
        runTestCases([
            {
                input: `{{get "x" this}}`,
                output: ``,
            }
        ], done);
    });

    it('accepts SafeString paths', (done) => {
        runTestCases([
            {
                input: `{{get (concat 'a' 'a') this}}`,
                output: `a`,
            },
            {
                input: `{{get (concat 'a' 'b') this}}`,
                output: `b`,
            }
        ], done);
    });
});