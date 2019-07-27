const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('getImageSrcset helper', function() {
    const urlData = 'https://cdn.example.com/path/to/{:size}/image.png?c=2';
    const urlData_2_qs = 'https://cdn.example.com/path/to/{:size}/image.png?c=2&imbypass=on';
    const context = {
        image_url: 'http://example.com/image.png',
        not_an_image: null,
        image: {
            data: urlData
        },
        image_with_2_qs: {
            data: urlData_2_qs,
            width: null,
            height: null,
        },
        image_with_dimensions: {
            data: urlData,
            width: 1400,
            height: 900,
        },
    };

    const runTestCases = testRunner({context});

    it('should return a srcset if a valid image and srcset sizes are passed', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset image 100w="100w" 200w="200w" 300w="300w" 1000w="1000w"}}',
                output: 'https://cdn.example.com/path/to/100w/image.png?c=2 100w, https://cdn.example.com/path/to/200w/image.png?c=2 200w, https://cdn.example.com/path/to/300w/image.png?c=2 300w, https://cdn.example.com/path/to/1000w/image.png?c=2 1000w',
            },
            {
                input: '{{getImageSrcset image_with_2_qs 100w="100w" 200w="200w" 300w="300w" 1000w="1000w"}}',
                output: 'https://cdn.example.com/path/to/100w/image.png?c=2&imbypass=on 100w, https://cdn.example.com/path/to/200w/image.png?c=2&imbypass=on 200w, https://cdn.example.com/path/to/300w/image.png?c=2&imbypass=on 300w, https://cdn.example.com/path/to/1000w/image.png?c=2&imbypass=on 1000w',
            },
            {
                input: '{{getImageSrcset image 1x="768x768" 2x="1536x1536"}}',
                output: 'https://cdn.example.com/path/to/768x768/image.png?c=2 1x, https://cdn.example.com/path/to/1536x1536/image.png?c=2 2x',
            },
        ], done);
    });

    it('should return a srcset made of default sizes if requested', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset image use_default_sizes=true}}',
                output: 'https://cdn.example.com/path/to/80w/image.png?c=2 80w, https://cdn.example.com/path/to/160w/image.png?c=2 160w, https://cdn.example.com/path/to/320w/image.png?c=2 320w, https://cdn.example.com/path/to/640w/image.png?c=2 640w, https://cdn.example.com/path/to/960w/image.png?c=2 960w, https://cdn.example.com/path/to/1280w/image.png?c=2 1280w, https://cdn.example.com/path/to/1920w/image.png?c=2 1920w, https://cdn.example.com/path/to/2560w/image.png?c=2 2560w',
            },
        ], done);
    });

    it('should return a srcset made of default sizes up to the width of the image if known', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset image_with_dimensions use_default_sizes=true}}',
                output: 'https://cdn.example.com/path/to/80w/image.png?c=2 80w, https://cdn.example.com/path/to/160w/image.png?c=2 160w, https://cdn.example.com/path/to/320w/image.png?c=2 320w, https://cdn.example.com/path/to/640w/image.png?c=2 640w, https://cdn.example.com/path/to/960w/image.png?c=2 960w, https://cdn.example.com/path/to/1280w/image.png?c=2 1280w, https://cdn.example.com/path/to/1400w/image.png?c=2 1400w',
            },
        ], done);
    });

    it('should return empty string if no parameters are passed', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset image}}',
                output: '',
            },
        ], done);
    });

    it('should return a srcset without a descriptor if a valid image and single srcset size is passed', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset image 100w="100w"}}',
                output: 'https://cdn.example.com/path/to/100w/image.png?c=2',
            },
            {
                input: '{{getImageSrcset image 1x="768x768"}}',
                output: 'https://cdn.example.com/path/to/768x768/image.png?c=2',
            },
        ], done);
    });


    it('should return a url if a url is passed', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset "http://example.com/image.jpg"}}',
                output: 'http://example.com/image.jpg',
            },
            {
                input: '{{getImageSrcset "https://example.com/image.jpg"}}',
                output: 'https://example.com/image.jpg',
            },
        ], done);
    });

    it('should return empty if srcset array is invalid', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset image 100="100w"}}',
                output: '',
            },
            {
                input: '{{getImageSrcset image abc="def"}}',
                output: '',
            },
        ], done);
    });

    it('should return empty if image is invalid', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset not_existing_image 100w="100w" 200w="200w"}}',
                output: '',
            },
            {
                input: '{{getImageSrcset not_an_image 100w="100w" 200w="200w"}}',
                output: '',
            },
        ], done);
    });

    it('should use the default image url if image is invalid', function(done) {
        runTestCases([
            {
                input: '{{getImageSrcset not_an_image "http://image" 100w="100w" 200w="200w"}}',
                output: 'http://image',
            },
            {
                input: '{{getImageSrcset not_an_image image_url 100w="100w" 200w="200w"}}',
                output: context.image_url,
            },
        ], done);
    });
});
