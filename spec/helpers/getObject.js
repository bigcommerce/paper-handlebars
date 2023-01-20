const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    testRunner = require('../spec-helpers').testRunner;

describe('getObject helper', function () {
    const context = {
        obj: {
            a: {
                b: {
                    c: 'd'
                },
                array: [1, 2, 3, 4, 5]
            },
            aa: 'a',
            ab: 'b',
        }
    };

    const runTestCases = testRunner({context});

    it('returns requested prop in correct object type', function (done) {
        runTestCases([
            {
                input: `{{#with (getObject "a.b.c" obj)}}{{c}}{{/with}}`,
                output: 'd',
            },
            {
                input: `{{getObject "a.array[2]" obj}}`,
                output: `3`,
            }
        ], done);
    });

    it('does not access prototype props', function (done) {
        context.obj.__proto__ = {x: 'yz'};
        runTestCases([
            {
                input: `{{#with (getObject "x" obj)}}{{x}}{{/with}}`,
                output: ``,
            },
        ], done);
    });

    it('accepts SafeString paths', (done) => {
        runTestCases([
            {
                input: `{{get 'aa' (getObject (concat 'a' 'a') obj)}}`,
                output: `a`,
            },
            {
                input: `{{get 'ab' (getObject (concat 'a' 'b') obj)}}`,
                output: `b`,
            }
        ], done);
    });
});