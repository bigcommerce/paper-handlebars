const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('resourceHints', function () {
    it('should return the expected resource links', function (done) {
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

        const runTestCases = testRunner({themeSettings});

        runTestCases([
            {
                input: '{{resourceHints}}',
                output: '<link rel="dns-prefetch preconnect" href="https://fonts.googleapis.com" crossorigin><link rel="dns-prefetch preconnect" href="https://fonts.gstatic.com" crossorigin>',
            },
        ], done);
    });
});
