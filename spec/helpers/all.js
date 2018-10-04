const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('all helper', function() {
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
        emptyString: "",
        big: 'big'
    };

    // Build a test runner that uses a default context
    const runTestCases = testRunner({context});

    it('(with single argument) should behave like if helper', function(done) {
        runTestCases([
            {
                input: '{{#all 1}}{{big}}{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all 1}}big{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all "x"}}big{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all ""}}big{{/all}}',
                output: '',
            },
            {
                input: '{{#all 0}}big{{/all}}',
                output: '',
            },
            {
                input: '{{#all ""}}big{{else}}small{{/all}}',
                output: 'small',
            },
            {
                input: '{{#all 0}}big{{else}}small{{/all}}',
                output: 'small',
            },
            {
                input: '{{#all num2}}big{{else}}small{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all product}}big{{else}}small{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all itemArray}}big{{else}}small{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all string}}big{{else}}small{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all emptyObject}}big{{else}}small{{/all}}',
                output: 'small',
            },
        ], done);
    });

    it('should render "big" if all conditions truthy', function(done) {
        runTestCases([
            {
                input: '{{#all "1" true}}big{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all 1 "1"}}big{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all "text" alwaysTrue}}big{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all alwaysTrue product num1 num2}}big{{/all}}',
                output: 'big',
            },
            {
                input: '{{#all alwaysTrue itemArray string}}big{{/all}}',
                output: 'big',
            },
        ], done);
    });

    it('should render empty if any condition is falsy', function(done) {
        runTestCases([
            {
                input: '{{#all emptyString num1}}big{{/all}}',
                output: '',
            },
            {
                input: '{{#all true 0 emptyArray alwaysTrue}}big{{/all}}',
                output: '',
            },
            {
                input: '{{#all true "" alwaysTrue}}big{{/all}}',
                output: '',
            },
        ], done);
    });
});
