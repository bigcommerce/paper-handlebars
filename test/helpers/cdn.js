var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context, settings, themeSettings) {
    return new Paper(settings, themeSettings).loadTemplatesSync({template: template}).render('template', context);
}

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
        expect(c('{{cdn "assets/css/style.css"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/css/style.css');

        expect(c('{{cdn "/assets/css/style.css"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/css/style.css');

        done();
    });

    it('should render normal assets cdn url', function (done) {
        expect(c('{{cdn "assets/js/app.js"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/js/app.js');

        expect(c('{{cdn "assets/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/img/image.jpg');

        done();
    });

    it('should not use the cdn url', function (done) {
        expect(c('{{cdn "assets/img/image.jpg"}}', context, {}))
            .to.be.equal('/assets/img/image.jpg');

        expect(c('{{cdn "assets/img/image.jpg"}}', context, {}))
            .to.be.equal('/assets/img/image.jpg');

        done();
    });

    it('should return the same value if it is a full url', function (done) {

        expect(c('{{cdn "https://example.com/app.js"}}', context, settings, themeSettings))
            .to.be.equal('https://example.com/app.js');

        expect(c('{{cdn "http://example.com/app.js"}}', context, settings, themeSettings))
            .to.be.equal('http://example.com/app.js');

        expect(c('{{cdn "//example.com/app.js"}}', context, settings, themeSettings))
            .to.be.equal('//example.com/app.js');

        done();
    });

    it('should return an empty string if no path is provided', function (done) {

        expect(c('{{cdn ""}}', context, settings, themeSettings))
            .to.be.equal('');

        done();
    });

    it('should return a webDav asset if webdav protocol specified', function (done) {

        expect(c('{{cdn "webdav:img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/content/img/image.jpg');

        expect(c('{{cdn "webdav:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/content/img/image.jpg');

        done();
    });

    it('should not return a webDav asset if webdav protocol is not correct', function (done) {

        expect(c('{{cdn "webbav:img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('/img/image.jpg');

        expect(c('{{cdn "webbav:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('/img/image.jpg');

        done();
    });

    it('should return a custom CDN asset if protocol is configured', function (done) {

        expect(c('{{cdn "customcdn1:img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://bigcommerce.customcdn.net/img/image.jpg');

        expect(c('{{cdn "customcdn1:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('https://bigcommerce.customcdn.net/img/image.jpg');

        expect(c('{{cdn "customcdn2:img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('http://cdn.mystore.com/img/image.jpg');

        expect(c('{{cdn "customcdn2:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('http://cdn.mystore.com/img/image.jpg');

        done();
    });

    it('should return a custom CDN asset when using nested helper', function (done) {

        expect(c('{{cdn (concat "customcdn1:" "img/image.jpg")}}', context, settings, themeSettings))
            .to.be.equal('https://bigcommerce.customcdn.net/img/image.jpg');

        expect(c('{{cdn (concat "customcdn1:" "/img/image.jpg")}}', context, settings, themeSettings))
            .to.be.equal('https://bigcommerce.customcdn.net/img/image.jpg');

        expect(c('{{cdn (concat "customcdn2:" "img/image.jpg")}}', context, settings, themeSettings))
            .to.be.equal('http://cdn.mystore.com/img/image.jpg');

        expect(c('{{cdn (concat "customcdn2:" "/img/image.jpg")}}', context, settings, themeSettings))
            .to.be.equal('http://cdn.mystore.com/img/image.jpg');

        done();
    });

    it('should return a local CDN asset if no cdn url is configured', function (done) {

        expect(c('{{cdn "customcdn1:img/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('/assets/cdn/customcdn1/img/image.jpg');

        expect(c('{{cdn "customcdn1:/img/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('/assets/cdn/customcdn1/img/image.jpg');

        expect(c('{{cdn "customcdn2:img/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('/assets/cdn/customcdn2/img/image.jpg');

        expect(c('{{cdn "customcdn2:/img/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('/assets/cdn/customcdn2/img/image.jpg');

        done();
    });

    it('should not return a custom CDN asset if protocol is not configured', function (done) {

        expect(c('{{cdn "customcdn1:img/image.jpg"}}', context, settings, {}))
            .to.be.equal('/img/image.jpg');

        expect(c('{{cdn "customcdn1:/img/image.jpg"}}', context, settings, {}))
            .to.be.equal('/img/image.jpg');

        done();
    });

    it('should return basic asset URL if protocol is not correct', function (done) {

        expect(c('{{cdn "randomProtocol::img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('/img/image.jpg');

        expect(c('{{cdn "randomProtocol:/img/image.jpg"}}', context, settings, themeSettings))
            .to.be.equal('/img/image.jpg');

        done();
    });
});
