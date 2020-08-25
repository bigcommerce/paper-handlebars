const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner,
      renderString = specHelpers.renderString;


describe('getImageManagerImage helper', function() {
    const siteSettings = {
        cdn_url: 'https://cdn.bcapp/3dsf74g',
    };
    const context = {
        object: {a:1}
    };

    const runTestCases = testRunner({context, siteSettings});


    it('should throw an exception if a url is passed', function (done) {
        renderString('{{getImageManagerImage "http://example.com/image.jpg"}}').catch(e => {
            done();
        });
    });

    it('should throw an exception if a non-string is passed', function (done) {
        renderString('{{getImageManagerImage object}}').catch(e => {
            renderString('{{getImageManagerImage 123').catch(e => {
                done();
            });
        });
    });

    it('should return an original image if no size is passed', function(done) {
        runTestCases([
            {
                input: '{{getImageManagerImage "asset.jpg"}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/asset.jpg'
            },
            {
                input: '{{getImageManagerImage "folder/asset.jpg"}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/folder/asset.jpg'
            },
        ], done);
    });

    it('should return an original image if invalid sizes are passed', function(done) {
        runTestCases([
            {
                input: '{{getImageManagerImage "asset.jpg" width="a"}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/asset.jpg'
            },
            {
                input: '{{getImageManagerImage "asset.jpg" width="a" height="a"}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/asset.jpg'
            },
            {
                input: '{{getImageManagerImage "asset.jpg" height=123}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/asset.jpg'
            },
            {
                input: '{{getImageManagerImage "folder/asset.jpg" height=123}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/folder/asset.jpg'
            },
        ], done);
    });

    it('should return a sized image', function(done) {
        runTestCases([
            {
                input: '{{getImageManagerImage "asset.jpg" width=123}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/123w/image-manager/asset.jpg'
            },
            {
                input: '{{getImageManagerImage "folder/asset.jpg" width=123}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/123w/image-manager/folder/asset.jpg'
            },
            {
                input: '{{getImageManagerImage "asset.jpg" width=123 height=321}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/123x321/image-manager/asset.jpg'
            },
            {
                input: '{{getImageManagerImage "folder/asset.jpg" width=123 height=321}}',
                output: 'https://cdn.bcapp/3dsf74g/images/stencil/123x321/image-manager/folder/asset.jpg'
            },
        ], done);
    });
});
