const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('replace helper', function() {
    const templates = {
        template2: 'day',
    };

    const context = {
        content: "Either you run the %%var%% or the  %%var%% runs you",
        price: '$49.99',
    };

    const runTestCases = testRunner({context, templates});

    it('should replace all ocurrance of %%var%% with "day"', function(done) {
        runTestCases([
            {
                input: "{{#replace '%%var%%' content}}{{> template2}}{{/replace}}",
                output: 'Either you run the day or the  day runs you',
            },
        ], done);
    });

    it('should handle undefined values', function(done) {
        runTestCases([
            {
                input: "{{#replace '%%var%%' content}}{{> template2}}{{/replace}}",
                output: '',
                context: {},
            },
        ], done);
    });

    it('should replace $', function(done) {
        runTestCases([
            {
                input: "{{#replace '$' price}}{{/replace}}",
                output: '49.99',
            },
            {
                input: "{{#replace '$' '$10.00'}}{{/replace}}",
                output: '10.00',
            },
            {
                input: "{{#replace '$' '$10.00'}}USD {{/replace}}",
                output: 'USD 10.00',
            },
        ], done);
    });

    it('should gracefully handle not strings', function(done) {
        runTestCases([
            {
                input: "{{#replace something price}}{{/replace}}",
                output: '',
            },
            {
                input: "{{#replace $ '$10.00'}}{{/replace}}",
                output: '',
            },
            {
                input: "{{#replace foo bar}}{{/replace}}",
                output: '',
            },
        ], done);
    });
});
