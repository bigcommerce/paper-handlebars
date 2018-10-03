const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('any helper (with option hash)', function() {
    const context = {
        big: 'big',
        arrayWithObjs: [{a: 1},{b: 1},{a: 2}]
    };

    // Build a test runner that uses a default context
    const runTestCases = testRunner({context});

    it('should return "big" with matching predicate ', function(done) {
        runTestCases([
            {
                input: '{{#any arrayWithObjs a=1}}{{big}}{{/any}}',
                output: 'big',
            },
            {
                input: '{{#any arrayWithObjs a=2}}{{big}}{{/any}}',
                output: 'big',
            },
            {
                input: '{{#any arrayWithObjs b=1}}{{big}}{{/any}}',
                output: 'big',
            },
        ], done);
    });

    it('should return nothing without matching predicate ', function(done) {
        runTestCases([
            {
                input: '{{#any arrayWithObjs b=2}}{{big}}{{/any}}',
                output: '',
            },
            {
                input: '{{#any arrayWithObjs c=1}}{{big}}{{/any}}',
                output: '',
            },
            {
                input: '{{#any arrayWithObjs num=2}}{{big}}{{/any}}',
                output: '',
            },
        ], done);
    });
});


describe('any helper (with multiple arguments)', function() {
    // DEPRECATED: Moved to #or helper
    const context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        string: 'yolo',
        alwaysTrue: true,
        alwaysFalse: false,
        emptyArray: [],
        emptyObject: {},
        itemArray: [1,2],
        big: 'big',
        arrayWithObjs: [{a: 1},{b: 1},{a: 2}]
    };

    // Build a test runner that uses a default context
    const runTestCases = testRunner({context});

    it('should return "big" if at least one arg valid', function(done) {
        runTestCases([
            {
                input: '{{#any arrayWithObjs string}}{{big}}{{/any}}',
                output: 'big',
            },
            {
                input: '{{#any "something test" itemArray}}{{big}}{{/any}}',
                output: 'big',
            },
            {
                input: '{{#any "this is before the other test"}}{{big}}{{/any}}',
                output: 'big',
            },
            {
                input: '{{#any alwaysFalse emptyArray string}}{{big}}{{/any}}',
                output: 'big',
            },
        ], done);
    });

    it('should return "" when no arguments are valid', function(done) {
        runTestCases([
            {
                input: '{{#any emptyArray emptyObject alwaysFalse}}{{big}}{{/any}}',
                output: '',
            },
            {
                input: '{{#any "" false}}{{big}}{{/any}}',
                output: '',
            },
        ], done);
    });
});
