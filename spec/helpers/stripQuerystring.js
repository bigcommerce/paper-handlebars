const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    testRunner = require('../spec-helpers').testRunner;

const themeSettings = {
    logo_image: '600x300',
};

describe('stripQuerystring helper', function() {
    const urlData_2_qs = 'https://cdn.example.com/path/to/{:size}/image.png?c=2&imbypass=on';
    const context = {
        image_with_2_qs: {
            data: urlData_2_qs
        },
    };

    const runTestCases = testRunner({context, themeSettings});

    it('strips the query string from a given url', function(done) {
        runTestCases([{
                input: `{{stripQuerystring 'http://www.example.com?foo=1&bar=2&baz=3'}}`,
                output: 'http://www.example.com',
            },
        ], done);
    });

    it('should work with the getImageSrcset helper as a nested expression', function(done) {
        runTestCases([{
            input: `{{stripQuerystring (getImageSrcset image_with_2_qs 1x='100x100')}}`,
            output: 'https://cdn.example.com/path/to/100x100/image.png',
        },
        ], done);
    });

    it('should work with the getImage helper as a nested expression', function(done) {
        runTestCases([
            {
                input: '{{stripQuerystring (getImage image_with_2_qs "logo_image")}}',
                output: 'https://cdn.example.com/path/to/600x300/image.png',
            },
        ], done);
    });
});
