const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('for helper', function() {
    const context = { name: 'Joe' };

    // Build a test runner
    const runTestCases = testRunner({context});

    it('should iterate once.', function(done) {
        runTestCases([
            {
                input: '{{#for 1 this}}{{$index}}:{{name}} {{/for}}',
                output: '1:Joe ',
            },
            {
                input: '{{#for 1 1 this}}{{$index}}:{{name}} {{/for}}',
                output: '1:Joe ',
            },
            {
                input: '{{#for 0 0 this}}{{$index}}:{{name}} {{/for}}',
                output: '0:Joe ',
            },
            {
                input: '{{#for 1000 1000 this}}{{$index}}:{{name}} {{/for}}',
                output: '1000:Joe ',
            },
        ], done);
    });

    it('should iterate 10 times', function(done) {
        runTestCases([
            {
                input: '{{#for 10 this}}{{$index}}:{{name}} {{/for}}',
                output: '1:Joe 2:Joe 3:Joe 4:Joe 5:Joe 6:Joe 7:Joe 8:Joe 9:Joe 10:Joe ',
            },
            {
                input: '{{#for 1 10 this}}{{$index}}:{{name}} {{/for}}',
                output: '1:Joe 2:Joe 3:Joe 4:Joe 5:Joe 6:Joe 7:Joe 8:Joe 9:Joe 10:Joe ',
            },
            {
                input: '{{#for 0 9 this}}{{$index}}:{{name}} {{/for}}',
                output: '0:Joe 1:Joe 2:Joe 3:Joe 4:Joe 5:Joe 6:Joe 7:Joe 8:Joe 9:Joe ',
            },
            {
                input: '{{#for 1000 1010 this}}{{$index}}:{{name}} {{/for}}',
                output: '1000:Joe 1001:Joe 1002:Joe 1003:Joe 1004:Joe 1005:Joe 1006:Joe 1007:Joe 1008:Joe 1009:Joe 1010:Joe ',
            },
        ], done);
    });

    it('should not iterate more than 100 times', function(done) {
        const expected = '.'.repeat(100);
        runTestCases([
            {
                input: '{{#for 0 99}}.{{/for}}',
                output: expected,
            },
            {
                input: '{{#for 1 100}}.{{/for}}',
                output: expected,
            },
            {
                input: '{{#for 0 3000 this}}.{{/for}}',
                output: expected,
            },
            {
                input: '{{#for 2015 3000}}.{{/for}}',
                output: expected,
            },
        ], done);
    });

    it('should render w/o context', function(done) {
        runTestCases([
            {
                input: '{{#for 10}}{{$index}} {{/for}}',
                output: '1 2 3 4 5 6 7 8 9 10 ',
            },
            {
                input: '{{#for 1 10}}{{$index}} {{/for}}',
                output: '1 2 3 4 5 6 7 8 9 10 ',
            },
            {
                input: '{{#for 0 9}}{{$index}} {{/for}}',
                output: '0 1 2 3 4 5 6 7 8 9 ',
            },
            {
                input: '{{#for 0 20}}.{{/for}}',
                output: '.....................',
            },
            {
                input: '{{#for 0 99}}{{/for}}',
                output: '',
            },
        ], done);
    });

    it('should convert strings to integers and iterate 10 times', function(done) {
        const context = {
            start: '1',
            end: '10'
        };

        runTestCases([
            {
                input: '{{#for start end}}{{$index}} {{/for}}',
                output: '1 2 3 4 5 6 7 8 9 10 ',
                context: context,
            },
        ], done);
    });

    it('should not iterate if "from" is less than "to"', function(done) {
        const context = {
            start: 10,
            end: 1
        };

        runTestCases([
            {
                input: '{{#for start end}}{{$index}} {{/for}}',
                output: '',
                context: context,
            },
        ], done);
    });
});
