const { describe, it } = exports.lab = require('lab').script();

const { testRunner } = require('../spec-helpers');

describe('JSONParseSafe helper', () => {
    const context = {
        jsonString: '{"name": "John"}',
        string: 'John Doe',
    };
    const runTestCases = testRunner({context});

    it('#Block: should execute the main instruction', done => {
        runTestCases([
            {
                input: '{{#JSONparseSafe jsonString}}{{name}}{{/JSONparseSafe}}',
                output: 'John',
            },
        ], done);
    });

    it('#Block: should skip the main instruction if variable is non-json', done => {
        runTestCases([
            {
                input: '{{#JSONparseSafe string}}{{name}}{{/JSONparseSafe}}',
                output: '',
            },
        ], done);
    });

    it('#Block: should execute the else instruction if variable is non-json', done => {
        runTestCases([
            {
                input: '{{#JSONparseSafe string}}{{name}}{{else}}{{string}}{{/JSONparseSafe}}',
                output: 'John Doe',
            },
        ], done);
    });

    // Variation of the Block Helper test to convert to an Inline Call.
    it('Inline: Output should match the same as `main test`', done => {
        runTestCases([
            {
                input: '{{#with (JSONparseSafe jsonString)}}{{this.name}}{{/with}}',
                output: 'John',
            },
        ], done);
    });

    it('Inline: Using JSON.stringify helper, and a empty object; parse the empty object and output it', done => {
        runTestCases([
            {
                input: '{{#with (JSONparseSafe "{}")}}{{json this}}{{/with}}',
                output: '{}',
            },
        ], done);
    });


    it('Inline: Using JSON.stringify helper, and a invalid / malformed object; parse the invalid object and output it, output is a Javascript `undefined` object', done => {
        runTestCases([
            {
                input: '{{#with (JSONparseSafe "{")}}Undefined response due to malformed input{{else}}{{/with}}',
                output: '',
            },
        ], done);
    });

    it('Inline: Stringifed example - with values', done => {
        runTestCases([
            {
                input: `{{json (JSONparseSafe '{"test": "value"}')}}`,
                output: "{&quot;test&quot;:&quot;value&quot;}",
            },
        ], done);
    });


    it('Inline: Stringifed example - without values', done => {
        runTestCases([
            {
                input: `{{json (JSONparseSafe '{}')}}`,
                output: '{}',
            },
        ], done);
    });

    it('Inline: Stringifed example - malformed input', done => {
        runTestCases([
            {
                input: `{{json (JSONparseSafe '{')}}`,
                output: '',
            },
        ], done);
    });
});
