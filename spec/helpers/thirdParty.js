var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('third party handlebars-helpers', function() {
    const context = {
        array: [1, 2, 3, 4, 5],
        options: { a: { b: { c: 'd' } } }
    };

    describe('array helpers', function() {

        describe('after helper', function() {
            it('returns all the items in an array after the index', function(done) {
                expect(renderString('{{after array 1}}', context))
                    .to.be.equal('2,3,4,5');

                done();
            });
        });

        describe('first helper', function() {
            it('returns the first n items in an array', function(done) {
                expect(renderString('{{first array 2}}', context))
                    .to.be.equal('1,2');

                done();
            });
        });

    });

    describe('collection helpers', function() {

        describe('length helper', function() {
            it('returns the length of the array', function(done) {
                expect(renderString('{{length array}}', context))
                    .to.be.equal('5');

                done();
            });
        });

    });

    describe('comparison helpers', function() {

        describe('contains helper', function() {
            it('renders the contains block if it evaluates to true', function(done) {
                expect(renderString(`{{#contains array 1}}This will be rendered.{{else}}This will not be rendered.{{/contains}}`, context))
                    .to.be.equal('This will be rendered.');

                done();
            });

            it('renders the else block if it evaluates to false', function(done) {
                expect(renderString(`{{#contains array '1'}}This will not be rendered.{{else}}This will be rendered.{{/contains}}`, context))
                    .to.be.equal('This will be rendered.');

                done();
            });
        });

    });

    describe('date helpers', function() {

        describe('contains moment', function() {
            it('renders the date in the format specified', function(done) {
                const now = new Date()
                expect(renderString(`{{#moment "1 year ago" "YYYY"}}{{/moment}}`, context))
                    .to.be.equal(`${now.getFullYear() - 1}`);

                done();
            });
        });

    });

    describe('html helpers', function() {

        describe('contains ellipsis', function() {
            it('truncates a string to the specified length and appends an ellipsis', function(done) {
                expect(renderString(`{{ellipsis "<span>foo bar baz</span>" 7}}`, context))
                    .to.be.equal('foo bar…');

                done();
            });
        });

        describe('contains thumbnailImage', function() {
            it('creates a <figure> with a thumbnail linked to an image', function(done) {
                const ctxt = {
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
                expect(renderString(`{{{thumbnailImage data}}}`, ctxt)).to.be
                    .equal('<figure id=\"image-id\">\n<img alt=\"alt\" src=\"thumbnail.png\" width=\"32\" height=\"32\">\n</figure>');

                done();
            });
        });

    });

    describe('inflection helpers', function() {

        describe('contains ordinalize', function() {
            it('returns an ordinalized number as a string', function(done) {
                expect(renderString(`{{ordinalize 42}}`, context))
                    .to.be.equal('42nd');

                done();
            });
        });

    });

    describe('markdown helpers', function() {

        describe('contains markdown', function() {
            it('converts a string of markdown to HTML', function(done) {
                expect(renderString(`{{#markdown}}# Foo{{/markdown}}`, context))
                    .to.be.equal('<h1>Foo</h1>\n');

                done();
            });
        });

    });

    describe('math helpers', function() {

        describe('contains avg', function() {
            it('returns the average of the numbers in an array', function(done) {
                expect(renderString(`{{avg array}}`, context))
                    .to.be.equal('3');

                done();
            });
        });

    });

    describe('misc helpers', function() {

        describe('contains option', function() {
            it('returns the nested prop of this.options', function(done) {
                expect(renderString(`{{option "a.b.c"}}`, context))
                    .to.be.equal('d');

                done();
            });
        });

    });

    describe('object helpers', function() {

        describe('contains isObject', function() {
            it('returns true if the value is an object', function(done) {
                expect(renderString(`{{isObject options}}`, context))
                    .to.be.equal('true');

                done();
            });

            it('returns false if the value is not an object', function(done) {
                expect(renderString(`{{isObject "foo"}}`, context))
                    .to.be.equal('false');

                done();
            });
        });

    });

    describe('string helpers', function() {

        describe('contains capitalize', function() {
            it('capitalizes the first word in a sentence', function(done) {
                expect(renderString(`{{capitalize "foo bar baz"}}`, context))
                    .to.be.equal('Foo bar baz');

                done();
            });
        });

    });

    describe('url helpers', function() {

        describe('contains stripQuerystring', function() {
            it('strips the query string from a given url', function(done) {
                expect(renderString(`{{stripQuerystring 'http://www.example.com?foo=1&bar=2&baz=3'}}`, context))
                    .to.be.equal('http://www.example.com');

                done();
            });
        });

    });

});
