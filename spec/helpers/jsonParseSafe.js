const { describe, it } = exports.lab = require('lab').script();

const { testRunner } = require('../spec-helpers');

describe('JSONParseSafe helper', () => {
    const context = {
        jsonString: '{"name": "John"}',
        string: 'John Doe',
    };
    const runTestCases = testRunner({context});

    it('should execute the main instruction', done => {
        runTestCases([
            {
                input: '{{#JSONparseSafe jsonString}}{{name}}{{/JSONparseSafe}}',
                output: 'John',
            },
        ], done);
    });

    it('should skip the main instruction if variable is non-json', done => {
        runTestCases([
            {
                input: '{{#JSONparseSafe string}}{{name}}{{/JSONparseSafe}}',
                output: '',
            },
        ], done);
    });

    it('should execute the else instruction if variable is non-json', done => {
        runTestCases([
            {
                input: '{{#JSONparseSafe string}}{{name}}{{else}}{{string}}{{/JSONparseSafe}}',
                output: 'John Doe',
            },
        ], done);
    });
});
