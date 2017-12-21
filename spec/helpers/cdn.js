var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('cdn helper', function () {
    var context = {};
    var settings = {
        cdn_url: 'https://cdn.bcapp/3dsf74g',
        theme_version_id: '123',
    };
    var themeSettings = {
        cdn: {
            customcdn1: 'https://bigcommerce.customcdn.net',
            customcdn2: 'http://cdn.mystore.com'
        }
    };

    it('should render the css cdn url', function (done) {
        expect(renderString('{{cdn "assets/css/style.css"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/css/style.css');

        expect(renderString('{{cdn "/assets/css/style.css"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/css/style.css');

        done();
    });

    it('should render normal assets cdn url', function (done) {
        expect(renderString('{{cdn "assets/js/app.js"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/js/app.js');

        expect(renderString('{{cdn "assets/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/img/image.jpg');

        done();
    });

    it('should not use the cdn url', function (done) {
        expect(renderString('{{cdn "assets/img/image.jpg"}}', context))
            .to.be.equal('/assets/img/image.jpg');

        expect(renderString('{{cdn "assets/img/image.jpg"}}', context))
            .to.be.equal('/assets/img/image.jpg');

        done();
    });

    it('should return the same value if it is a full url', function (done) {

        expect(renderString('{{cdn "https://example.com/app.js"}}', context, settings, themeSettings))
            .to.be.equal('https://example.com/app.js');

        expect(renderString('{{cdn "http://example.com/app.js"}}', context, settings, themeSettings))
            .to.be.equal('http://example.com/app.js');

        expect(renderString('{{cdn "//example.com/app.js"}}', context, settings, themeSettings))
            .to.be.equal('//example.com/app.js');

        done();
    });

    it('should return an empty string if no path is provided', function (done) {

        expect(renderString('{{cdn ""}}', context, settings, themeSettings))
            .to.be.equal('');

        done();
    });

    it('should return a webDav asset if webdav protocol specified', function (done) {

        expect(renderString('{{cdn "webdav:img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/content/img/image.jpg');

        expect(renderString('{{cdn "webdav:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/content/img/image.jpg');

        done();
    });

    it('should not return a webDav asset if webdav protocol is not correct', function (done) {

        expect(renderString('{{cdn "webbav:img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('/img/image.jpg');

        expect(renderString('{{cdn "webbav:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('/img/image.jpg');

        done();
    });

    it('should return a custom CDN asset if protocol is configured', function (done) {

        expect(renderString('{{cdn "customcdn1:img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://bigcommerce.customcdn.net/img/image.jpg');

        expect(renderString('{{cdn "customcdn1:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://bigcommerce.customcdn.net/img/image.jpg');

        expect(renderString('{{cdn "customcdn2:img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('http://cdn.mystore.com/img/image.jpg');

        expect(renderString('{{cdn "customcdn2:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('http://cdn.mystore.com/img/image.jpg');

        done();
    });

    it('should return a custom CDN asset when using nested helper', function (done) {

        expect(renderString('{{cdn (concat "customcdn1:" "img/image.jpg")}}', context, settings, themeSettings))
            .to.be.equal('https://bigcommerce.customcdn.net/img/image.jpg');

        expect(renderString('{{cdn (concat "customcdn1:" "/img/image.jpg")}}', context, settings, themeSettings))
            .to.be.equal('https://bigcommerce.customcdn.net/img/image.jpg');

        expect(renderString('{{cdn (concat "customcdn2:" "img/image.jpg")}}', context, settings, themeSettings))
            .to.be.equal('http://cdn.mystore.com/img/image.jpg');

        expect(renderString('{{cdn (concat "customcdn2:" "/img/image.jpg")}}', context, settings, themeSettings))
            .to.be.equal('http://cdn.mystore.com/img/image.jpg');

        done();
    });

    it('should return a local CDN asset if no cdn url is configured', function (done) {

        expect(renderString('{{cdn "customcdn1:img/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('/assets/cdn/customcdn1/img/image.jpg');

        expect(renderString('{{cdn "customcdn1:/img/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('/assets/cdn/customcdn1/img/image.jpg');

        expect(renderString('{{cdn "customcdn2:img/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('/assets/cdn/customcdn2/img/image.jpg');

        expect(renderString('{{cdn "customcdn2:/img/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('/assets/cdn/customcdn2/img/image.jpg');

        done();
    });

    it('should not return a custom CDN asset if protocol is not configured', function (done) {

        expect(renderString('{{cdn "customcdn1:img/image.jpg"}}', context, settings, {}))
            .to.be.equal('/img/image.jpg');

        expect(renderString('{{cdn "customcdn1:/img/image.jpg"}}', context, settings, {}))
            .to.be.equal('/img/image.jpg');

        done();
    });

    it('should return basic asset URL if protocol is not correct', function (done) {

        expect(renderString('{{cdn "randomProtocol::img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('/img/image.jpg');

        expect(renderString('{{cdn "randomProtocol:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('/img/image.jpg');

        done();
    });
});
