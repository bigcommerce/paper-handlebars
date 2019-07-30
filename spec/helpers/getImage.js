const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

const themeSettings = {
    logo_image: '600x300',
    gallery: '100x100',
    _images: {
        logo: {
            width: 250,
            height: 100
        },
        gallery: {
            width: 300,
            height: 300
        },
        missing_values: {},
        missing_width: {height: 100}
    }
};

describe('getImage helper', function() {
    const urlData = 'https://cdn.example.com/path/to/{:size}/image.png?c=2';
    const urlData_2_qs = 'https://cdn.example.com/path/to/{:size}/image.png?c=2&imbypass=on';
    const context = {
        image_url: 'http://example.com/image.png',
        not_an_image: null,
        image: {
            data: urlData,
            width: null,
            height: null,
        },
        image_with_dimensions: {
            data: urlData,
            width: 123,
            height: 123,
        },
        image_with_2_qs: {
            data: urlData_2_qs
        },
        logoPreset: 'logo',
    };

    const runTestCases = testRunner({context, themeSettings});

    it('should return a url if a url is passed', function(done) {
        runTestCases([
            {
                input: '{{getImage "http://example.com/image.jpg"}}',
                output: 'http://example.com/image.jpg',
            },
        ], done);
    });

    it('should return empty if image is invalid', function(done) {
        runTestCases([
            {
                input: '{{getImage not_existing_image}}',
                output: '',
            },
            {
                input: '{{getImage not_an_image}}',
                output: '',
            },
        ], done);
    });

    it('should use the preset from _images', function(done) {
        runTestCases([
            {
                input: '{{getImage image "logo"}}',
                output: urlData.replace('{:size}', '250x100'),
            },
            {
                input: '{{getImage image_with_2_qs "logo"}}',
                output: urlData_2_qs.replace('{:size}', '250x100'),
            },
            {
                input: '{{getImage image "gallery"}}',
                output: urlData.replace('{:size}', '300x300'),
            },
            {
                input: '{{getImage image_with_2_qs "gallery"}}',
                output: urlData_2_qs.replace('{:size}', '300x300'),
            },
        ], done);
    });

    it('should use the size from the theme_settings', function(done) {
        runTestCases([
            {
                input: '{{getImage image "logo_image"}}',
                output: urlData.replace('{:size}', '600x300'),
            },
        ], done);
    });

    it('should use the default image url if image is invalid', function(done) {
        runTestCases([
            {
                input: '{{getImage not_an_image "logo" "http://image"}}',
                output: 'http://image',
            },
            {
                input: '{{getImage not_an_image "logo" image_url}}',
                output: context.image_url,
            },
        ], done);
    });

    it('should use original size if not default is passed', function(done) {
        runTestCases([
            {
                input: '{{getImage image "bad_preset"}}',
                output: urlData.replace('{:size}', 'original'),
            },
        ], done);
    });

    it('should default to max value (width & height) if value is not provided', function(done) {
        runTestCases([
            {
                input: '{{getImage image "missing_values"}}',
                output: urlData.replace('{:size}', '5120x5120'),
            },
            {
                input: '{{getImage image "missing_width"}}',
                output: urlData.replace('{:size}', '5120x100'),
            },
        ], done);
    });

    it('should default to size of the image dimensions if known and a larger size is requested', function(done) {
        runTestCases([
            {
                input: '{{getImage image_with_dimensions "logo"}}',
                output: urlData.replace('{:size}', '123x100'),
            },
            {
                input: '{{getImage image_with_dimensions "logo_image"}}',
                output: urlData.replace('{:size}', '123x123'),
            },
        ], done);
    });
});
