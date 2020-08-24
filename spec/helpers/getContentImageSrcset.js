const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner,
      renderString = specHelpers.renderString;


describe('getContentImageSrcset helper', function() {
    const siteSettings = {
        cdn_url: 'https://cdn.bcapp/3dsf74g',
    };
    const context = {
        object: {a:1}
    };

    const runTestCases = testRunner({context, siteSettings});


    it('should throw an exception if a url is passed', function (done) {
        renderString('{{getContentImageSrcset "http://example.com/image.jpg"}}').catch(e => {
            done();
        });
    });

    it('should throw an exception if a non-string is passed', function (done) {
        renderString('{{getContentImageSrcset object}}').catch(e => {
            renderString('{{getContentImageSrcset 123').catch(e => {
                done();
            });
        });
    });

    it('should return a valid srcset', function(done) {
        runTestCases([
            {
                input: '{{getContentImageSrcset "asset.jpg"}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/80w/content/asset.jpg 80w, https://cdn.bcapp/3dsf74g/images/stencil/160w/content/asset.jpg 160w, https://cdn.bcapp/3dsf74g/images/stencil/320w/content/asset.jpg 320w, https://cdn.bcapp/3dsf74g/images/stencil/640w/content/asset.jpg 640w, https://cdn.bcapp/3dsf74g/images/stencil/960w/content/asset.jpg 960w, https://cdn.bcapp/3dsf74g/images/stencil/1280w/content/asset.jpg 1280w, https://cdn.bcapp/3dsf74g/images/stencil/1920w/content/asset.jpg 1920w, https://cdn.bcapp/3dsf74g/images/stencil/2560w/content/asset.jpg 2560w'
            },
            {
                input: '{{getContentImageSrcset "folder/asset.jpg" width=123}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/80w/content/folder/asset.jpg 80w, https://cdn.bcapp/3dsf74g/images/stencil/160w/content/folder/asset.jpg 160w, https://cdn.bcapp/3dsf74g/images/stencil/320w/content/folder/asset.jpg 320w, https://cdn.bcapp/3dsf74g/images/stencil/640w/content/folder/asset.jpg 640w, https://cdn.bcapp/3dsf74g/images/stencil/960w/content/folder/asset.jpg 960w, https://cdn.bcapp/3dsf74g/images/stencil/1280w/content/folder/asset.jpg 1280w, https://cdn.bcapp/3dsf74g/images/stencil/1920w/content/folder/asset.jpg 1920w, https://cdn.bcapp/3dsf74g/images/stencil/2560w/content/folder/asset.jpg 2560w'
            },
        ], done);
    });
});
