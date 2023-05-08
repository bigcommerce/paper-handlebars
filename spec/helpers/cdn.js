const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    {testRunner, buildRenderer} = require('../spec-helpers');
const {expect} = require("code");

describe('cdn helper', function () {
    const context = {
        brand: 'visa',
    };
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
    const hbVersion = 'v4';

    // Build a test runner that uses a default context
    const runTestCases = testRunner({context, siteSettings, themeSettings, hbVersion});

    it('should render the css cdn url and produce resource hints when attribute resourceHint is part of the template', function (done) {
        const renderer = buildRenderer(siteSettings, themeSettings, {}, hbVersion);
        const runTestCases = testRunner({context, renderer});
        runTestCases([
            {
                input: '{{cdn "assets/css/style.css" resourceHint="preload" as="style" crossorigin="use-credentials"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/css/style.css',
            },
            {
                input: '{{cdn "/assets/css/style.modal.css" resourceHint="preconnect" as="style" crossorigin="anonymous"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/css/style.modal.css',
            },
            {
                input: '{{cdn "/assets/css/style.modal.css" as="style" crossorigin="use-credentials"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/css/style.modal.css',
            }
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints).to.have.length(2);
            hints.forEach(hint => {
                expect(hint.state).to.satisfy((state) => state === 'preload' || state === 'preconnect');
                expect(hint.type).to.equals("style");
                expect(hint.cors).to.satisfy((cors) => cors === 'anonymous' || cors === 'use-credentials');
            });
            done();
        });
    });

    it('should render the css cdn url and produce resource hint without as/type attribute', function (done) {
        const renderer = buildRenderer(siteSettings, themeSettings, {}, hbVersion);
        const runTestCases = testRunner({context, renderer});
        runTestCases([
            {
                input: '{{cdn "assets/css/style.css" resourceHint="preload" as="should-not-be-included"}}',
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/css/style.css',
            }
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints).to.have.length(1);
            hints.forEach(hint => {
                expect(hint.state).to.equals('preload');
                expect(hint.type).to.not.exist();
                expect(hint.cors).to.equals('no');
            });
            done();
        });
    });

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

    it('should return a custom CDN asset when using nested concat helper', function (done) {
        runTestCases([
            {
                input: '{{cdn (concat (concat "customcdn2:" "/img/image.jpg") "?test")}}',
                output: 'http://cdn.mystore.com/img/image.jpg?test',
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
            {
                input: "{{cdn (concat (concat 'img/payment-methods/' brand) '.svg')}}",
                output: 'https://cdn.bcapp/3dsf74g/stencil/123/img/payment-methods/visa.svg',
            }
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
