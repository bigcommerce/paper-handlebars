const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('third party handlebars-helpers', function() {
    const context = {
        array: [1, 2, 3, 4, 5],
        options: { a: { b: { c: 'd' } } }
    };

    const runTestCases = testRunner({context});

    describe('array helpers', function() {

        describe('after helper', function() {
            it('returns all the items in an array after the index', function(done) {
                runTestCases([
                    {
                        input: '{{after array 1}}',
                        output: '2,3,4,5',
                    },
                ], done);
            });
        });

        describe('first helper', function() {
            it('returns the first n items in an array', function(done) {
                runTestCases([
                    {
                        input: '{{first array 2}}',
                        output: '1,2',
                    },
                ], done);
            });
        });

        describe('pluck helper', function() {
            const context = {
                users: [
                    { 'user': 'barney', 'age': 36 },
                    { 'user': 'fred',   'age': 40 }
                ]
            };

            const runTestCases = testRunner({context});

            it('should get the values from all elements in collection', function(done) {
                runTestCases([
                    {
                        input: '{{pluck users "age"}}',
                        output: '36,40',
                    },
                    {
                        input: '{{#each (pluck users "user")}}hello {{this}} {{/each}}',
                        output: 'hello barney hello fred ',
                    },
                ], done);
            });
        });

    });

    describe('collection helpers', function() {

        describe('length helper', function() {
            it('returns the length of the array', function(done) {
                runTestCases([
                    {
                        input: '{{length array}}',
                        output: '5',
                    },
                ], done);
            });
        });

    });

    describe('comparison helpers', function() {

        describe('contains helper', function() {
            it('renders the contains block if it evaluates to true', function(done) {
                runTestCases([
                    {
                        input: `{{#contains array 1}}This will be rendered.{{else}}This will not be rendered.{{/contains}}`,
                        output: 'This will be rendered.',
                    },
                ], done);
            });

            it('renders the else block if it evaluates to false', function(done) {
                runTestCases([
                    {
                        input: `{{#contains array '1'}}This will not be rendered.{{else}}This will be rendered.{{/contains}}`,
                        output: 'This will be rendered.',
                    },
                ], done);
            });

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
                    // {
                    //     input: '{{#contains haystack needle}}FOUND{{/contains}}',
                    //     output: 'FOUND',
                    //     context: {
                    //         needle: { key: 'value' },
                    //         haystack: {
                    //             foo: { key: 'value' }
                    //         }
                    //     },
                    // },
                    // {
                    //     input: '{{#contains haystack needle}}FOUND{{/contains}}',
                    //     output: 'FOUND',
                    //     context: {
                    //         needle: 'bar',
                    //         haystack: {
                    //             foo: 'bar'
                    //         }
                    //     },
                    // },
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

    });

    describe('date helpers', function() {

        describe('contains moment', function() {
            it('renders the date in the format specified', function(done) {
                const now = new Date();
                runTestCases([
                    {
                        input: `{{#moment "1 year ago" "YYYY"}}{{/moment}}`,
                        output: `${now.getFullYear() - 1}`,
                    },
                ], done);
            });
        });

    });

    describe('html helpers', function() {

        describe('contains thumbnailImage', function() {
            it('creates a <figure> with a thumbnail linked to an image', function(done) {
                const context = {
                    data: {
                        id: 'id',
                        alt: 'alt',
                        thumbnail: 'thumbnail.png',
                        size: {
                            width: 32,
                            height: 32
                        }
                    }
                };

                runTestCases([
                    {
                        input: `{{{thumbnailImage data}}}`,
                        output: '<figure id=\"image-id\">\n<img alt=\"alt\" src=\"thumbnail.png\" width=\"32\" height=\"32\">\n</figure>',
                        context: context,
                    },
                ], done);
            });
        });

    });

    describe('inflection helpers', function() {

        describe('contains ordinalize', function() {
            it('returns an ordinalized number as a string', function(done) {
                runTestCases([
                    {
                        input: `{{ordinalize 42}}`,
                        output: '42nd',
                    },
                ], done);
            });
        });

    });

    describe('markdown helpers', function() {

        describe('contains markdown', function() {
            it('converts a string of markdown to HTML', function(done) {
                runTestCases([
                    {
                        input: `{{#markdown}}# Foo{{/markdown}}`,
                        output: '<h1>Foo</h1>\n',
                    },
                ], done);
            });
        });

    });

    describe('math helpers', function() {

        describe('contains avg', function() {
            it('returns the average of the numbers in an array', function(done) {
                runTestCases([
                    {
                        input: `{{avg array}}`,
                        output: '3',
                    },
                ], done);
            });
        });

    });

    describe('misc helpers', function() {

        describe('contains option', function() {
            it('returns the nested prop of this.options', function(done) {
                runTestCases([
                    {
                        input: `{{option "a.b.c"}}`,
                        output: 'd',
                    },
                ], done);
            });
        });

    });

    describe('object helpers', function() {

        describe('contains isObject', function() {
            it('returns true if the value is an object', function(done) {
                runTestCases([
                    {
                        input: `{{isObject options}}`,
                        output: 'true',
                    },
                ], done);
            });

            it('returns false if the value is not an object', function(done) {
                runTestCases([
                    {
                        input: `{{isObject "foo"}}`,
                        output: 'false',
                    },
                ], done);
            });
        });

    });

    describe('string helpers', function() {

        describe('contains capitalize', function() {
            it('capitalizes the first word in a sentence', function(done) {
                runTestCases([
                    {
                        input: `{{capitalize "foo bar baz"}}`,
                        output: 'Foo bar baz',
                    },
                ], done);
            });
        });

        describe('contains ellipsis', function() {
            it('truncates a string to the specified length and appends an ellipsis', function(done) {
                runTestCases([
                    {
                        input: `{{ellipsis "foo bar baz" 7}}`,
                        output: 'foo bar…',
                    },
                ], done);
            });
        });
    });
});
