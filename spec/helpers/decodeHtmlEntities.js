const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner,
      renderString = specHelpers.renderString;


describe('decodeHtmlEntities helper', function() {
    const context = {
        string: 'foo &copy; bar &ne; baz &#x1D306; qux',
    };

    const runTestCases = testRunner({context});

    // Some test cases lifted from https://github.com/mathiasbynens/he

    it('should return a string with HTML entities decoded', function(done) {
        runTestCases([
            {
                input: '{{decodeHtmlEntities "foo &copy; bar &ne; baz &#x1D306; qux"}}',
                output: `foo © bar ≠ baz 𝌆 qux`,
            },
            {
                input: '{{decodeHtmlEntities string}}',
                output: `foo © bar ≠ baz 𝌆 qux`,
            },
        ], done);
    });

    it('should return a string with HTML entities decoded with isAttributeValue enabled', function(done) {
        runTestCases([
            {
                input: '{{decodeHtmlEntities "foo&ampbar" isAttributeValue="true"}}',
                output: `foo&ampbar`,
            },
        ], done);
    });

    it('should throw a parse error in strict mode', function(done) {
        renderString('{{decodeHtmlEntities "foo&ampbar" strict="true"}}').catch(e => {
            done();
        });
    });

    it('should throw an exception if an invalid named argument is passed', function (done) {
        renderString('{{decodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" strict="blah"}}').catch(e => {
            renderString('{{decodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" blah="true"}}').catch(e => {
                done();
            });
        });
    });

    it('should throw an exception if a non-string argument is passed', function (done) {
        renderString('{{decodeHtmlEntities 123}}').catch(e => {
            done();
        });
    });
});
