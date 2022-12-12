const { describe, it } = exports.lab = require('lab').script();

const { testRunner } = require('../spec-helpers');

describe('JSONParseSafe helper', () => {
    const context = {
        jsonString: '{"name": "John"}',
        string: 'John Doe',
    };
    const runTestCases = testRunner({context});

    it('should have the same behavior as the original if helper', done => {
        runTestCases([
            {
                input: '{{#JSONparseSafe string}}{{name}}{{/JSONparseSafe}}',
                output: '',
            },
            {
                input: '{{#JSONparseSafe jsonString}}{{name}}{{/JSONparseSafe}}',
                output: 'John',
            },
            {
                input: '{{#JSONparseSafe string}}{{name}}{{else}}{{string}}{{/JSONparseSafe}}',
                output: 'John Doe',
            },
        ], done);
    });
});
