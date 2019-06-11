const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('cdn helper', function () {
    const context = {};
    const siteSettings = {
        cdn_url: 'https://cdn.bcapp/3dsf74g',
        theme_version_id: '123',
    };
    const themeSettings = {
        cdn: {
            customcdn1: 'https://bigcommerce.customcdn.net',
            customcdn2: 'http://cdn.mystore.com',
        }
    };

    // Build a test runner that uses a default context
    const runTestCases = testRunner({context, siteSettings, themeSettings});

    it('should render the css cdn url', function (done) {
        runTestCases([
            {
                input: '{{cdn "assets/css/style.css"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/css/style.css',
            },
            {
                input: '{{cdn "/assets/css/style.css"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/css/style.css',
            },
        ], done);
    });

    it('should render normal assets cdn url', function (done) {
        runTestCases([
            {
                input: '{{cdn "assets/js/app.js"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/js/app.js',
            },
            {
                input: '{{cdn "assets/img/image.jpg"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/img/image.jpg',
            },
        ], done);
    });

    it('should not use the cdn url', function (done) {
        runTestCases([
            {
                input: '{{cdn "assets/img/image.jpg"}}',
                output: '/assets/img/image.jpg',
                siteSettings: {},
                themeSettings: {},
            },
            {
                input: '{{cdn "assets/img/image.jpg"}}',
                output: '/assets/img/image.jpg',
                siteSettings: {},
                themeSettings: {},
            },
        ], done);
    });

    it('should return the same value if it is a full url', function (done) {
        runTestCases([
            {
                input: '{{cdn "https://example.com/app.js"}}',
                output: 'https://example.com/app.js',
            },
            {
                input: '{{cdn "http://example.com/app.js"}}',
                output: 'http://example.com/app.js',
            },
            {
                input: '{{cdn "//example.com/app.js"}}',
                output: '//example.com/app.js',
            },
        ], done);
    });

    it('should delete any . and / from the begining of the path if this is not a full path', function (done) {
        runTestCases([
            {
                input: '{{cdn "../img/icon-sprite.svg"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/img/icon-sprite.svg',
            },
            {
                input: '{{cdn "./img/icon-sprite.svg"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/img/icon-sprite.svg',
            },
            {
                input: '{{cdn "/img/icon-sprite.svg"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/img/icon-sprite.svg',
            },
            {
                input: '{{cdn "../../img/icon-sprite.svg"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/img/icon-sprite.svg',
            },
            {
                input: '{{cdn "../../../img/icon-sprite.svg"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/img/icon-sprite.svg',
            },
            {
                input: '{{cdn "../../../IMG/icon-sprite.svg"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/IMG/icon-sprite.svg',
            },
            {
                input: '{{cdn "../../../456IMG/icon-sprite.svg"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/456IMG/icon-sprite.svg',
            },
            {
                input: '{{cdn "../../../456IMG/icon-sprite.svg/"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/456IMG/icon-sprite.svg/',
            },
            {
                input: '{{cdn "../../../456IMG/icon-sprite.svg."}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/456IMG/icon-sprite.svg.',
            },
            {
                input: '{{cdn "../../../456IMG/icon-sprite.svg./"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/456IMG/icon-sprite.svg./',
            },
            {
                input: '{{cdn "../../../456IMG/icon-sprite.svg../"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/456IMG/icon-sprite.svg../',
            },
            {
                input: '{{cdn "../../../456IMG/icon-sprite.svg../../"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/456IMG/icon-sprite.svg../../',
            },
        ], done);
    });

    it('should return an empty string if no path is provided', function (done) {
        runTestCases([
            {
                input: '{{cdn ""}}',
                output: '',
            },
        ], done);
    });

    it('should return a webDav asset if webdav protocol specified', function (done) {
        runTestCases([
            {
                input: '{{cdn "webdav:img/image.jpg"}}',
                output: 'https://cdn.bcapp/3dsf74g/content/img/image.jpg',
            },
            {
                input: '{{cdn "webdav:/img/image.jpg"}}',
                output: 'https://cdn.bcapp/3dsf74g/content/img/image.jpg',
            },
            {
                input: '{{cdn "webdav://img/image.jpg"}}',
                output: 'https://cdn.bcapp/3dsf74g/content/img/image.jpg',
            },
        ], done);
    });

    it('should not return a webDav asset if webdav protocol is not correct', function (done) {
        runTestCases([
            {
                input: '{{cdn "webbav:img/image.jpg"}}',
                output: '/img/image.jpg',
            },
            {
                input: '{{cdn "webbav:/img/image.jpg"}}',
                output: '/img/image.jpg',
            },
        ], done);
    });

    it('should return a custom CDN asset if protocol is configured', function (done) {
        runTestCases([
            {
                input: '{{cdn "customcdn1:img/image.jpg"}}',
                output: 'https://bigcommerce.customcdn.net/img/image.jpg',
            },
            {
                input: '{{cdn "customcdn1:/img/image.jpg"}}',
                output: 'https://bigcommerce.customcdn.net/img/image.jpg',
            },
            {
                input: '{{cdn "customcdn2:img/image.jpg"}}',
                output: 'http://cdn.mystore.com/img/image.jpg',
            },
            {
                input: '{{cdn "customcdn2:/img/image.jpg"}}',
                output: 'http://cdn.mystore.com/img/image.jpg',
            },
        ], done);
    });

    it('should return a custom CDN asset when using nested helper', function (done) {
        runTestCases([
            {
                input: '{{cdn (concat "customcdn1:" "img/image.jpg")}}',
                output: 'https://bigcommerce.customcdn.net/img/image.jpg',
            },
            {
                input: '{{cdn (concat "customcdn1:" "/img/image.jpg")}}',
                output: 'https://bigcommerce.customcdn.net/img/image.jpg',
            },
            {
                input: '{{cdn (concat "customcdn2:" "img/image.jpg")}}',
                output: 'http://cdn.mystore.com/img/image.jpg',
            },
            {
                input: '{{cdn (concat "customcdn2:" "/img/image.jpg")}}',
                output: 'http://cdn.mystore.com/img/image.jpg',
            },
        ], done);
    });

    it('should return a local CDN asset if no cdn url is configured', function (done) {
        runTestCases([
            {
                input: '{{cdn "customcdn1:img/image.jpg"}}',
                output: '/assets/cdn/customcdn1/img/image.jpg',
                siteSettings: {},
            },
            {
                input: '{{cdn "customcdn1:/img/image.jpg"}}',
                output: '/assets/cdn/customcdn1/img/image.jpg',
                siteSettings: {},
            },
            {
                input: '{{cdn "customcdn2:img/image.jpg"}}',
                output: '/assets/cdn/customcdn2/img/image.jpg',
                siteSettings: {},
            },
            {
                input: '{{cdn "customcdn2:/img/image.jpg"}}',
                output: '/assets/cdn/customcdn2/img/image.jpg',
                siteSettings: {},
            },
        ], done);
    });

    it('should not return a custom CDN asset if protocol is not configured', function (done) {
        runTestCases([
            {
                input: '{{cdn "customcdn1:img/image.jpg"}}',
                output: '/img/image.jpg',
                themeSettings: {},
            },
            {
                input: '{{cdn "customcdn1:/img/image.jpg"}}',
                output: '/img/image.jpg',
                themeSettings: {},
            },
        ], done);
    });

    it('should return basic asset URL if protocol is not correct', function (done) {
        runTestCases([
            {
                input: '{{cdn "randomProtocol::img/image.jpg"}}',
                output: '/img/image.jpg',
            },
            {
                input: '{{cdn "randomProtocol:/img/image.jpg"}}',
                output: '/img/image.jpg',
            },
        ], done);
    });

    it('should avoid double slash in path', function (done) {
        runTestCases([
            {
                input: '{{cdn "img/icon-sprite.svg"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/img/icon-sprite.svg',
            }
        ], done);
    });
});
