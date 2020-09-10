const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    testRunner = require('../spec-helpers').testRunner;

describe('contains helper', function() {
    const context = {};

    // Build a test runner
    const runTestCases = testRunner({ context });

    it('should evaluate inner expression when haystack contains needle', function(done) {
        runTestCases([
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: 'FOUND',
                context: {
                    needle: "hello",
                    haystack: "hello world"
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: 'FOUND',
                context: {
                    needle: { key: 'value' },
                    haystack: {
                        foo: { key: 'value' }
                    }
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: 'FOUND',
                context: {
                    needle: 'bar',
                    haystack: {
                        foo: 'bar'
                    }
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: 'FOUND',
                context: {
                    needle: 1,
                    haystack: [1, 2, 3]
                },
            },
            {
                input: '{{#contains haystack "world"}}FOUND{{/contains}}',
                output: 'FOUND',
                context: {
                    haystack: "hello world"
                },
            }
        ], done)
    });

    it('should not evaluate inner expression when haystack does not include the needle', function(done) {
        runTestCases([
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: "work",
                    haystack: "hello world"
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: null,
                    haystack: null
                },
            },
            {
                input: '{{#contains haystack needle.one}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: {},
                    haystack: undefined
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: undefined,
                    haystack: undefined
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: 'oops',
                    haystack: undefined
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: null,
                    haystack: {
                        key: null
                    }
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: null,
                    haystack: {
                        foo: {
                            key: null
                        }
                    }
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: 'foo',
                    haystack: {
                        foo: 'bar'
                    }
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: { key: 'value' },
                    haystack: {
                        foo: { key: 'wrong value' }
                    }
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: 'bar',
                    haystack: {
                        bar: 'baz'
                    }
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: [],
                    haystack: {
                        foo: 'bar'
                    }
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: null,
                    haystack: {
                        foo: 'bar'
                    }
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: 4,
                    haystack: [1, 2, 3]
                },
            },
            {
                input: '{{#contains haystack "work"}}FOUND{{/contains}}',
                output: '',
                context: {
                    haystack: "hello world"
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: null,
                    haystack: "hello world"
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: undefined,
                    haystack: [1, 2, 3]
                },
            }
        ], done)
    });

    it('when we have malformed input should not evaluate inner expression', function(done) {
        runTestCases([
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    haystack: {}
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    haystack: null
                },
            },
            {
                input: '{{#contains haystack "work"}}FOUND{{/contains}}',
                output: '',
                context: {
                    haystack: undefined
                },
            },
            {
                input: '{{#contains haystack "work"}}FOUND{{/contains}}',
                output: '',
                context: {
                    haystack: 42
                },
            },
            {
                input: '{{#contains haystack needle}}FOUND{{/contains}}',
                output: '',
                context: {
                    needle: [1,2,3],
                    haystack: undefined
                },
            }
        ], done)
    });
});
