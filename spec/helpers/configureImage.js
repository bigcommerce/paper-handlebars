const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('configureImage helper', function() {
    const urlData = 'https://cdn.example.com/path/to/{:size}/image.png?c=2';
    const urlData_imbypass = 'https://cdn.example.com/path/to/{:size}/image.png?c=2&imbypass=on';
    const context = {
        image_url: 'http://example.com/image.png',
        not_an_image: null,
        image: {
            data: urlData
        },
        image_imbypass: {
            data: urlData_imbypass
        },
        logoPreset: 'logo',
    };

    const themeSettings = {
        logo_image: '600x300',
    };

    const runTestCases = testRunner({context, themeSettings});

    it('should return blank if a URL is passed', function(done) {
        runTestCases([
            {
                input: '{{getImage (configureImage "http://example.com/image.jpg" disable-all-optimizations=true)}}',
                output: '',
            },
            {
                input: '{{configureImage "http://example.com/image.jpg" disable-all-optimizations=true}}',
                output: '',
            },
        ], done);
    });

    it('should reset the URL if no parameters are passed', function(done) {
        runTestCases([
            {
                input: '{{getImage (configureImage image) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}`,
            },
            {
                input: '{{getImage (configureImage image_imbypass) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300').replace('&imbypass=on', '')}`,
            },
        ], done);
    });

    it('should return a correct URL if truthy parameters are passed', function(done) {
        runTestCases([
            {
                input: '{{getImage (configureImage image disable-all-optimizations=true) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}&imbypass=1`,
            },
            {
                input: '{{getImage (configureImage image_imbypass disable-all-optimizations=true) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}&imbypass=1`,
            },
            {
                input: '{{getImage (configureImage image disable-device-sizing=true) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}&imdevicesize=0`,
            },
            {
                input: '{{getImage (configureImage image_imbypass disable-device-sizing=true) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}&imdevicesize=0`,
            },
            {
                input: '{{getImage (configureImage image disable-device-formatting=true) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}&imdeviceformat=0`,
            },
            {
                input: '{{getImage (configureImage image_imbypass disable-device-formatting=true) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}&imdeviceformat=0`,
            },
            {
                input: '{{getImage (configureImage image disable-device-formatting=true disable-device-sizing=true) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}&imdevicesize=0&imdeviceformat=0`,
            },
            {
                input: '{{getImage (configureImage image_imbypass disable-device-formatting=true disable-device-sizing=true) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}&imdevicesize=0&imdeviceformat=0`,
            },

        ], done);
    });

    it('should return a correct URL if falsy parameters are passed', function(done) {
        runTestCases([
            {
                input: '{{getImage (configureImage image disable-all-optimizations=false) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}`,
            },
            {
                input: '{{getImage (configureImage image_imbypass disable-all-optimizations=false) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300').replace('&imbypass=on', '')}`,
            },
            {
                input: '{{getImage (configureImage image disable-device-sizing=false) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}`,
            },
            {
                input: '{{getImage (configureImage image disable-device-formatting=false) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}`,
            },
            {
                input: '{{getImage (configureImage image disable-device-formatting=false disable-device-sizing=false) "logo_image"}}',
                output: `${urlData.replace('{:size}', '600x300')}`,
            },
        ], done);
    });
});
