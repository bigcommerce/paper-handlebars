var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

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
    var urlData = 'https://cdn.example.com/path/to/{:size}/image.png';
    var context = {
        image_url: 'http://example.com/image.png',
        not_an_image: null,
        image: {
            data: urlData
        },
        logoPreset: 'logo',
    };

    it('should return a url if a url is passed', function(done) {
        expect(renderString('{{getImage "http://example.com/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('http://example.com/image.jpg');

        expect(renderString('{{getImage "https://example.com/image.jpg"}}', context, {}, themeSettings))
            .to.be.equal('https://example.com/image.jpg');

        done();
    });

    it('should return empty if image is invalid', function(done) {

        expect(renderString('{{getImage not_existing_image}}', context, {}, themeSettings))
            .to.be.equal('');

        expect(renderString('{{getImage not_an_image}}', context, {}, themeSettings))
            .to.be.equal('');

        done();
    });

    it('should use the preset from _images', function(done) {

        expect(renderString('{{getImage image "logo"}}', context, {}, themeSettings))
            .to.be.equal(urlData.replace('{:size}', '250x100'));

        expect(renderString('{{getImage image "gallery"}}', context, {}, themeSettings))
            .to.be.equal(urlData.replace('{:size}', '300x300'));

        done();
    });

    it('should use the size from the theme_settings', function(done) {

        expect(renderString('{{getImage image "logo_image"}}', context, {}, themeSettings))
            .to.be.equal(urlData.replace('{:size}', '600x300'));

        done();
    });

    it('should use the default image url if image is invalid', function(done) {

        expect(renderString('{{getImage not_an_image "logo" "http://image"}}', context, {}, themeSettings))
            .to.be.equal('http://image');

        expect(renderString('{{getImage not_an_image "logo" image_url}}', context, {}, themeSettings))
            .to.be.equal(context.image_url);

        done();
    });

    it('should use original size if not default is passed', function(done) {

        expect(renderString('{{getImage image "bad_preset"}}', context, {}, themeSettings))
            .to.be.equal(urlData.replace('{:size}', 'original'));

        done();
    });


    it('should default to max value (width & height) if value is not provided', function(done) {

        expect(renderString('{{getImage image "missing_values"}}', context, {}, themeSettings))
            .to.be.equal(urlData.replace('{:size}', '4096x4096'));

        expect(renderString('{{getImage image "missing_width"}}', context, {}, themeSettings))
            .to.be.equal(urlData.replace('{:size}', '4096x100'));

        done();
    });
});
