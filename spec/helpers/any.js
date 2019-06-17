const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('any helper (with option hash)', function() {
    const context = {
        big: 'big',
        arrayWithObjs: [{a: 1},{b: 1},{a: 2}],
        objWithObjs: {a: {a: true},b: {b: 1}, c: {a: 2}},
        arrayWithMultipleObjs: [{a: {a:1, b:2}}, {b: {b:1, c:2}}],
        objWithMultipleObjs: {a: {a:1, b:2}, b: {b:1, c:2}}
    };

    // Build a test runner that uses a default context
    const runTestCases = testRunner({context});

    it('should return "big" if every element of predicate is matched on an object', function(done) {
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

    it('should return "big" if every element of predicate is matched on an object', function(done) {
        runTestCases([
            {
                input: '{{#any objWithObjs a=true}}{{big}}{{/any}}',
                output: 'big',
            },
            {
                input: '{{#any objWithObjs a=2}}{{big}}{{/any}}',
                output: 'big',
            },
            {
                input: '{{#any objWithObjs b=1}}{{big}}{{/any}}',
                output: 'big',
            },
        ], done);
    });

    it('should return nothing without matching single predicate for an object', function(done) {
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

    it('should return nothing without matching single predicate for an object', function(done) {
        runTestCases([
            {
                input: '{{#any objWithObjs b=2}}{{big}}{{/any}}',
                output: '',
            },
            {
                input: '{{#any objWithObjs c=1}}{{big}}{{/any}}',
                output: '',
            },
            {
                input: '{{#any objWithObjs num=2}}{{big}}{{/any}}',
                output: '',
            },
        ], done);
    });

    it('should return "big" if every element of predicate is matched on an object', function(done) {
        runTestCases([
            {
                input: '{{#any arrayWithObjs b=2 a=1}}{{big}}{{/any}}',
                output: '',
            },
            {
                input: '{{#any arrayWithObjs c=2 b=1}}{{big}}{{/any}}',
                output: '',
            },
        ], done);
    });

    it('should return nothing without matching all predicate for an object', function(done) {
        runTestCases([
            {
                input: '{{#any arrayWithObjs b=2 a=3}}{{big}}{{/any}}',
                output: '',
            },
            {
                input: '{{#any arrayWithObjs c=1 d=5}}{{big}}{{/any}}',
                output: '',
            },
        ], done);
    });

    it('should return "big" if every element of predicate is matched on an object', function(done) {
        runTestCases([
            {
                input: '{{#any objWithObjs a=1 b=2}}{{big}}{{/any}}',
                output: '',
            },
            {
                input: '{{#any objWithObjs b=1 c=2}}{{big}}{{/any}}',
                output: '',
            },
        ], done);
    });

    it('should return nothing without matching all predicate for an object', function(done) {
        runTestCases([
            {
                input: '{{#any objWithObjs b=2 b=9}}{{big}}{{/any}}',
                output: '',
            },
            {
                input: '{{#any objWithObjs c=1 d=6}}{{big}}{{/any}}',
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