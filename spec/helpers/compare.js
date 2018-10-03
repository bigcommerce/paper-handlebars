const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('compare helper', function() {
    const context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        string: 'yolo'
    };

    // Build a test runner that uses a default context
    const runTestCases = testRunner({context});

    it('should render "big" if all compares match', function(done) {
        runTestCases([
            {
                input: '{{#compare "1" num1 operator="=="}}big{{/compare}}',
                output: 'big',
            },
            {
                input: '{{#compare 1 num1 operator="==="}}big{{/compare}}',
                output: 'big',
            },
            {
                input: '{{#compare 2 num1 operator="!=="}}big{{/compare}}',
                output: 'big',
            },
            {
                input: '{{#compare num2 num1 operator="!="}}big{{/compare}}',
                output: 'big',
            },
            {
                input: '{{#compare num2 num1 operator=">"}}big{{/compare}}',
                output: 'big',
            },
            {
                input: '{{#compare num1 num2 operator="<"}}big{{/compare}}',
                output: 'big',
            },
            {
                input: '{{#compare num2 num1 operator=">="}}big{{/compare}}',
                output: 'big',
            },
            {
                input: '{{#compare num1 num2 operator="<="}}big{{/compare}}',
                output: 'big',
            },
            {
                input: '{{#compare product "object" operator="typeof"}}big{{/compare}}',
                output: 'big',
            },
            {
                input: '{{#compare string "string" operator="typeof"}}big{{/compare}}',
                output: 'big',
            },
        ], done);
    });

    it('should render empty for all cases', function(done) {
        runTestCases([
            {
                input: '{{#compare "2" num1 operator="=="}}big{{/compare}}',
                output: '',
            },
            {
                input: '{{#compare 2 num1 operator="==="}}big{{/compare}}',
                output: '',
            },
            {
                input: '{{#compare 1 num1 operator="!=="}}big{{/compare}}',
                output: '',
            },
            {
                input: '{{#compare num2 2 operator="!="}}big{{/compare}}',
                output: '',
            },
            {
                input: '{{#compare num1 20 operator=">"}}big{{/compare}}',
                output: '',
            },
            {
                input: '{{#compare 4 num2 operator="<"}}big{{/compare}}',
                output: '',
            },
            {
                input: '{{#compare num1 40 operator=">="}}big{{/compare}}',
                output: '',
            },
            {
                input: '{{#compare num2 num1 operator="<="}}big{{/compare}}',
                output: '',
            },
            {
                input: '{{#compare product "string" operator="typeof"}}big{{/compare}}',
                output: '',
            },
            {
                input: '{{#compare string "object" operator="typeof"}}big{{/compare}}',
                output: '',
            },
        ], done);
    });
});
