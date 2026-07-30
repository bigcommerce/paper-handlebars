const { describe, it } = exports.lab = require('lab').script();

const { testRunner, renderString} = require('../spec-helpers');

describe('typeof inline', () => {
    const context = {
        string: 'John Doe',
        number: 123,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        objectValue: { name: 'John' },
        array: ['John', 'Doe'],
        // eslint-disable-next-line no-undef
        bigint: BigInt(12345678901234567890),
        functionValue: () => {},
    };
    const runTestCases = testRunner({context});

    it('should return string', done => {
        runTestCases([
            {
                input: '{{typeof string}}',
                output: 'string',
            },
        ], done);
    });

    it('should return number', done => {
        runTestCases([
            {
                input: '{{typeof number}}',
                output: 'number',
            },
        ], done);
    });

    it('should return boolean', done => {
        runTestCases([
            {
                input: '{{typeof boolean}}',
                output: 'boolean',
            },
        ], done);
    });

    it('should return object: null', done => {
        runTestCases([
            {
                input: '{{typeof nullValue}}',
                output: 'object', // Null is an object in JavaScript
            },
        ], done);
    });

    it('should return object: undefined', done => {
        runTestCases([
            {
                input: '{{typeof undefinedValue}}',
                output: 'undefined',
            },
        ], done);
    });

    it('should return object: object', done => {
        runTestCases([
            {
                input: '{{typeof objectValue}}',
                output: 'object',
            },
        ], done);
    });

    it('should return object: array', done => {
        runTestCases([
            {
                input: '{{typeof array}}',
                output: 'object',
            },
        ], done);
    });

    it('should return bigInt', done => {
        runTestCases([
            {
                input: '{{typeof bigint}}',
                output: 'bigint',
            },
        ], done);
    });

    it('should return function', done => {
        runTestCases([
            {
                input: '{{typeof functionValue}}',
                output: 'function',
            },
        ], done);
    });


    it('should work with output from another function', done => {
        runTestCases([
            {
                input: '{{typeof (multiConcat string number)}}',
                output: 'string',
            },
        ], done);
    });

    it('should not accept more than one value, throw a error', function(done) {
        renderString("{{typeof number string}}", context).catch(_ => {
            done();
        });
    });

    it('should not work as a block helper, throw a error', function(done) {
        renderString("{{#typeof number}}content{{/typeof}}", context).catch(_ => {
            done();
        });
    });
});
