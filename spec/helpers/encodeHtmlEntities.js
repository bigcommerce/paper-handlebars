const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner,
      renderString = specHelpers.renderString;


describe('encodeHtmlEntities helper', function() {
    const context = {
        string: 'foo © bar ≠ baz 𝌆 qux',
        quotes: '"some" \'quotes\'',
    };

    const runTestCases = testRunner({context});

    // Some test cases lifted from https://github.com/mathiasbynens/he

    it('should return a string with HTML entities encoded', function(done) {
        runTestCases([
            {
                input: '{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux"}}',
                output: `foo &#xA9; bar &#x2260; baz &#x1D306; qux`,
            },
            {
                input: '{{encodeHtmlEntities string}}',
                output: `foo &#xA9; bar &#x2260; baz &#x1D306; qux`,
            },
            {
                input: '{{encodeHtmlEntities "string"}}',
                output: `string`,
            },
            {
                input: '{{encodeHtmlEntities quotes}}',
                output: `&#x22;some&#x22; &#x27;quotes&#x27;`,
            },
            {
                input: '{{encodeHtmlEntities "an ampersand: &"}}',
                output: `an ampersand: &#x26;`,
            },
        ], done);
    });

    it('should return a string with HTML entities encoded with named references', function(done) {
        runTestCases([
            {
                input: '{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" useNamedReferences="true"}}',
                output: `foo &copy; bar &ne; baz &#x1D306; qux`,
            },
        ], done);
    });

    it('should return a string with HTML entities encoded with decimal option', function(done) {
        runTestCases([
            {
                input: '{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" decimal="true"}}',
                output: `foo &#169; bar &#8800; baz &#119558; qux`,
            },
        ], done);
    });

    it('should return a string with HTML entities encoded with named references and decimal option', function(done) {
        runTestCases([
            {
                input: '{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" useNamedReferences="true" decimal="true"}}',
                output: `foo &copy; bar &ne; baz &#119558; qux`,
            },
        ], done);
    });

    it('should return a string with HTML entities encoded with encodeEverything option', function(done) {
        runTestCases([
            {
                input: '{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" encodeEverything="true"}}',
                output: `&#x66;&#x6F;&#x6F;&#x20;&#xA9;&#x20;&#x62;&#x61;&#x72;&#x20;&#x2260;&#x20;&#x62;&#x61;&#x7A;&#x20;&#x1D306;&#x20;&#x71;&#x75;&#x78;`,
            },
        ], done);
    });

    it('should return a string with HTML entities encoded with encodeEverything and useNamedReferences option', function(done) {
        runTestCases([
            {
                input: '{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" encodeEverything="true" useNamedReferences="true"}}',
                output: `&#x66;&#x6F;&#x6F;&#x20;&copy;&#x20;&#x62;&#x61;&#x72;&#x20;&ne;&#x20;&#x62;&#x61;&#x7A;&#x20;&#x1D306;&#x20;&#x71;&#x75;&#x78;`,
            },
        ], done);
    });

    it('should return a string with HTML entities encoded with allowUnsafeSymbols option', function(done) {
        runTestCases([
            {
                input: '{{encodeHtmlEntities "foo © and & ampersand" allowUnsafeSymbols="true"}}',
                output: `foo &#xA9; and & ampersand`,
            },
        ], done);
    });

    it('should throw an exception if an invalid named argument is passed', function (done) {
        renderString('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" useNamedReferences="blah"}}').catch(e => {
            renderString('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" blah="true"}}').catch(e => {
                done();
            });
        });
    });

    it('should throw an exception if a non-string argument is passed', function (done) {
        renderString('{{encodeHtmlEntities 123}}').catch(e => {
            done();
        });
    });
});
