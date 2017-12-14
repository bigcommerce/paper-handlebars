var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    var themeSettings = {
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
    return new Paper({}, themeSettings).loadTemplatesSync({template: template}).render('template', context);
}

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
        expect(c('{{getImage "http://example.com/image.jpg"}}', context))
            .to.be.equal('http://example.com/image.jpg');

        expect(c('{{getImage "https://example.com/image.jpg"}}', context))
            .to.be.equal('https://example.com/image.jpg');

        done();
    });

    it('should return empty if image is invalid', function(done) {

        expect(c('{{getImage not_existing_image}}', context))
            .to.be.equal('');

        expect(c('{{getImage not_an_image}}', context))
            .to.be.equal('');

        done();
    });

    it('should use the preset from _images', function(done) {

        expect(c('{{getImage image "logo"}}', context))
            .to.be.equal(urlData.replace('{:size}', '250x100'));

        expect(c('{{getImage image "gallery"}}', context))
            .to.be.equal(urlData.replace('{:size}', '300x300'));

        done();
    });

    it('should use the size from the theme_settings', function(done) {

        expect(c('{{getImage image "logo_image"}}', context))
            .to.be.equal(urlData.replace('{:size}', '600x300'));

        done();
    });

    it('should use the default image url if image is invalid', function(done) {

        expect(c('{{getImage not_an_image "logo" "http://image"}}', context))
            .to.be.equal('http://image');

        expect(c('{{getImage not_an_image "logo" image_url}}', context))
            .to.be.equal(context.image_url);

        done();
    });

    it('should use original size if not default is passed', function(done) {

        expect(c('{{getImage image "bad_preset"}}', context))
            .to.be.equal(urlData.replace('{:size}', 'original'));

        done();
    });


    it('should default to max value (width & height) if value is not provided', function(done) {

        expect(c('{{getImage image "missing_values"}}', context))
            .to.be.equal(urlData.replace('{:size}', '4096x4096'));

        expect(c('{{getImage image "missing_width"}}', context))
            .to.be.equal(urlData.replace('{:size}', '4096x100'));

        done();
    });
});
