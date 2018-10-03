const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('getFontLoaderConfig', function () {
    it('should return the expected font config', function (done) {
        const themeSettings = {
            'test1-font': 'Google_Open+Sans',
            'test2-font': 'Google_Open+Sans_400italic',
            'test3-font': 'Google_Open+Sans_700',
            'test4-font': 'Google_Karla_700',
            'test5-font': 'Google_Lora_400_sans',
            'test6-font': 'Google_Volkron',
            'test7-font': 'Google_Droid_400,700',
            'test8-font': 'Google_Crimson+Text_400,700_sans',
            'random-property': 'not a font'
        };

        const expectedConfig = {
            google: {
                families: ['Open Sans:,400italic,700', 'Karla:700', 'Lora:400', 'Volkron:', 'Droid:400,700', 'Crimson Text:400,700']
            }
        };

        const runTestCases = testRunner({themeSettings});
        runTestCases([
            {
                input: '{{getFontLoaderConfig}}',
                output: JSON.stringify(expectedConfig),
            },
        ], done);
    });
});
