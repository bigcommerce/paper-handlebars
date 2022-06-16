const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    testRunner = require('../spec-helpers').testRunner;

describe('get helper', function () {
    const context = {
        array: [1, 2, 3, 4, 5],
        options: { a: { b: { c: 'd' } } }
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
});