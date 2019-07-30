const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner,
      renderString = specHelpers.renderString;


describe('setURLQueryParam helper', function() {
    const context = {
        image_url: 'http://example.com/image.png',
        not_a_url: null,
        key: 'referrer',
        value: 'google',
    };

    const runTestCases = testRunner({context});

    it('should return a URL with an added parameter given correct input', function(done) {
        runTestCases([
            {
                input: '{{setURLQueryParam "http://example.com/image.jpg" key value}}',
                output: `http://example.com/image.jpg?${context.key}=${context.value}`,
            },
            {
                input: '{{setURLQueryParam image_url "key" "value"}}',
                output: `${context.image_url}?key=value`,
            },
            {
                input: '{{setURLQueryParam (setURLQueryParam image_url "key" "value") "key2" "value2"}}',
                output: `${context.image_url}?key=value&key2=value2`,
            },
            {
                input: '{{setURLQueryParam "http://example.com/product-1?sku=abc123" "key" "value"}}',
                output: 'http://example.com/product-1?sku=abc123&key=value',
            },
        ], done);
    });

    it('should return a URL with an updated parameter given correct input', function(done) {
        runTestCases([
            {
                input: '{{setURLQueryParam "http://example.com/image.jpg?c=2" "c" "3"}}',
                output: `http://example.com/image.jpg?c=3`,
            },
            {
                input: '{{setURLQueryParam "http://example.com/image.jpg?a=1&c=2" "c" "3"}}',
                output: `http://example.com/image.jpg?a=1&c=3`,
            },
            {
                input: '{{setURLQueryParam (setURLQueryParam "http://example.com/image.jpg?a=1&c=2" "a" "2") "c" "3"}}',
                output: `http://example.com/image.jpg?a=2&c=3`,
            },
            {
                input: '{{setURLQueryParam "http://example.com/product-1?sku=abc123" "sku" "def456"}}',
                output: 'http://example.com/product-1?sku=def456',
            },
        ], done);
    });

    it('should throw an exception if a url is passed with no parameters', function (done) {
        renderString('{{setURLQueryParam "http://example.com/image.jpg"}}').catch(e => {
            renderString('{{setURLQueryParam urlData}}').catch(e => {
                done();
            });
        });
    });

    it('should throw an exception if a url is passed with only one parameter', function (done) {
        renderString('{{setURLQueryParam "http://example.com/image.jpg" "key"}}').catch(e => {
            renderString('{{setURLQueryParam urlData key}}').catch(e => {
                done();
            });
        });
    });

    it('should throw an exception if an invalid URL is passed', function (done) {
        renderString('{{setURLQueryParam not_a_url key value}}').catch(e => {
            renderString('{{setURLQueryParam not_a_url "key" "value"}}').catch(e => {
                renderString('{{setURLQueryParam "not_a_url" "key" "value"}}').catch(e => {
                    renderString('{{setURLQueryParam "not_a_url" key value}}').catch(e => {
                        done();
                    });
                });
            });
        });
    });
});
