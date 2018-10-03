const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('or helper', function() {
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

    const runTestCases = testRunner({context});

    it('should return "big" if at least one arg valid', function(done) {
        runTestCases([
            {
                input: '{{#or arrayWithObjs string}}{{big}}{{/or}}',
                output: 'big',
            },
            {
                input: '{{#or "something test" itemArray}}{{big}}{{/or}}',
                output: 'big',
            },
            {
                input: '{{#or "this is before the other test"}}{{big}}{{/or}}',
                output: 'big',
            },
            {
                input: '{{#or alwaysFalse emptyArray string}}{{big}}{{/or}}',
                output: 'big',
            },
        ], done);
    });

    it('should return "" when no arguments are valid', function(done) {
        runTestCases([
            {
                input: '{{#or emptyArray emptyObject alwaysFalse}}{{big}}{{/or}}',
                output: '',
            },
            {
                input: '{{#or "" false}}{{big}}{{/or}}',
                output: '',
            },
        ], done);
    });
});

