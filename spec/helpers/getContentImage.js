const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner,
      renderString = specHelpers.renderString;


describe('getContentImage helper', function() {
    const siteSettings = {
        cdn_url: 'https://cdn.bcapp/3dsf74g',
    };
    const context = {
        object: {a:1}
    };

    const runTestCases = testRunner({context, siteSettings});


    it('should throw an exception if a url is passed', function (done) {
        renderString('{{getContentImage "http://example.com/image.jpg"}}').catch(e => {
            done();
        });
    });

    it('should throw an exception if a non-string is passed', function (done) {
        renderString('{{getContentImage object}}').catch(e => {
            renderString('{{getContentImage 123').catch(e => {
                done();
            });
        });
    });

    it('should return an original image if no size is passed', function(done) {
        runTestCases([
            {
                input: '{{getContentImage "asset.jpg"}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/content/asset.jpg'
            },
            {
                input: '{{getContentImage "folder/asset.jpg"}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/content/folder/asset.jpg'
            },
        ], done);
    });

    it('should return an original image if invalid sizes are passed', function(done) {
        runTestCases([
            {
                input: '{{getContentImage "asset.jpg" width="a"}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/content/asset.jpg'
            },
            {
                input: '{{getContentImage "asset.jpg" width="a" height="a"}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/content/asset.jpg'
            },
            {
                input: '{{getContentImage "asset.jpg" height=123}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/content/asset.jpg'
            },
            {
                input: '{{getContentImage "folder/asset.jpg" height=123}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/content/folder/asset.jpg'
            },
        ], done);
    });

    it('should return a sized image', function(done) {
        runTestCases([
            {
                input: '{{getContentImage "asset.jpg" width=123}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/123w/content/asset.jpg'
            },
            {
                input: '{{getContentImage "folder/asset.jpg" width=123}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/123w/content/folder/asset.jpg'
            },
            {
                input: '{{getContentImage "asset.jpg" width=123 height=321}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/123x321/content/asset.jpg'
            },
            {
                input: '{{getContentImage "folder/asset.jpg" width=123 height=321}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/123x321/content/folder/asset.jpg'
            },
        ], done);
    });
});
