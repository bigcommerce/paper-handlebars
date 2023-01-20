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
            },
            {
                input: `{{get (concat 'options.a' '.b.c') this}}`,
                output: `d`,
            }
        ], done);
    });

    it('gets context from options object if none was given', (done) => {
        runTestCases([
            {
                input: `{{#get 'hash.a' a='some string'}}{{this}}{{/get}}`,
                output: `some string`,
            },
        ], done);
    });

    it('renders to the empty string if no args are passed', (done) => {
        runTestCases([
            {
                input: `{{get }}`,
                output: ``,
            }
        ], done);
    });

    it('returns the object arg if it is a string, number, undefined, or null', (done) => {
        runTestCases([
            {
                input: `{{get 'a' 'some string'}}`,
                output: `some string`,
            },
            {
                input: `{{get 'a' 42}}`,
                output: `42`,
            },
            {
                input: `{{get 'a' undefined}}`,
                output: ``,
            },
            {
                input: `{{get 'a' null}}`,
                output: ``,
            }
        ], done);
    });

    it('returns undefined if prop path does not exist', (done) => {
        runTestCases([
            { // a key does not exist
                input: `{{get 'z.z' options}}`,
                output: ``,
            },
            { // first key exists, but its value is `undefined`
                input:`{{get '0.zyx' (pluck (arrayify options) 'b')}}`, // array: [ undefined ]
                output: ``,
            }
        ], done);
    });
});