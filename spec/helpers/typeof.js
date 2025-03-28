const { describe, it } = exports.lab = require('lab').script();

const { testRunner } = require('../spec-helpers');

describe('typeof inline', () => {
    const context = {
        string: 'John Doe',
        number: 123,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        objectValue: { name: 'John' },
        array: ['John', 'Doe'],
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
                output: 'undefined', // Null is an object in JavaScript
            },
        ], done);
    });

    it('should return object: object', done => {
        runTestCases([
            {
                input: '{{typeof objectValue}}',
                output: 'object', // Null is an object in JavaScript
            },
        ], done);
    });

    it('should return object: array', done => {
        runTestCases([
            {
                input: '{{typeof array}}',
                output: 'object', // Null is an object in JavaScript
            },
        ], done);
    });

    it('should return bigInt', done => {
        runTestCases([
            {
                input: '{{typeof bigint}}',
                output: 'bigint', // Null is an object in JavaScript
            },
        ], done);
    });

    it('should return function', done => {
        runTestCases([
            {
                input: '{{typeof functionValue}}',
                output: 'function', // Null is an object in JavaScript
            },
        ], done);
    });
});
