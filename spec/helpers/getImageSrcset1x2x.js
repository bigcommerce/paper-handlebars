const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner,
      renderString = specHelpers.renderString;

describe('getImageSrcset1x2x helper', function() {
    const urlData = 'https://cdn.example.com/path/to/{:size}/image.png?c=2';
    const context = {
        image_size_small: "123x456",
        image_size_large: "1000x900",
        image_url: 'http://example.com/image.png',
        not_an_image: null,
        image_without_dimensions: {
            data: urlData
        },
        image_with_null_dimensions: {
            data: urlData,
            width: null,
            height: null,
        },
        image_with_dimensions: {
            data: urlData,
            width: 1400,
            height: 950,
        },
        image_with_large_dimensions: {
            data: urlData,
            width: 5200,
            height: 5200,
        },
    };

    const runTestCases = testRunner({context});

    it('should return a srcset if a valid image and srcset sizes are passed', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset1x2x image_with_dimensions "123x456"}}',
                output: 'https://cdn.example.com/path/to/123x456/image.png?c=2 1x, https://cdn.example.com/path/to/246x912/image.png?c=2 2x',
            },
            {
                input: '{{getImageSrcset1x2x image_with_dimensions "123x556"}}',
                output: 'https://cdn.example.com/path/to/123x556/image.png?c=2 1x, https://cdn.example.com/path/to/210x950/image.png?c=2 1.7086x',
            },
            {
                input: '{{getImageSrcset1x2x image_with_dimensions image_size_small}}',
                output: 'https://cdn.example.com/path/to/123x456/image.png?c=2 1x, https://cdn.example.com/path/to/246x912/image.png?c=2 2x',
            },
        ], done);
    });

    it('should return an image url alone (1x) if the 2x size is not within constraints', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset1x2x image_with_dimensions "1000x900"}}',
                output: 'https://cdn.example.com/path/to/1000x900/image.png?c=2',
            },
            {
                input: '{{getImageSrcset1x2x image_with_dimensions image_size_large}}',
                output: 'https://cdn.example.com/path/to/1000x900/image.png?c=2',
            },
            {
                input: '{{getImageSrcset1x2x image_with_large_dimensions "2600x2600"}}',
                output: 'https://cdn.example.com/path/to/2600x2600/image.png?c=2',
            },
        ], done);
    });

    it('should return an image url alone (1x) if image does not have dimesions', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset1x2x image_with_null_dimensions "1000x900"}}',
                output: 'https://cdn.example.com/path/to/1000x900/image.png?c=2',
            },
            {
                input: '{{getImageSrcset1x2x image_without_dimensions "1000x900"}}',
                output: 'https://cdn.example.com/path/to/1000x900/image.png?c=2',
            },
        ], done);
    });

    it('should throw an exception if an no size argument is passed', function (done) {
        renderString('{{getImageSrcset1x2x image_with_dimensions}}').catch(e => {
            done();
        });
    });

    it('should throw an exception if an invalid size argument is passed', function (done) {
        renderString('{{getImageSrcset1x2x image_with_dimensions "100px"}}').catch(e => {
            done();
        });
    });
});
