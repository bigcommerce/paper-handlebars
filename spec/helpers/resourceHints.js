const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    {testRunner, buildRenderer} = require('../spec-helpers');
const {expect} = require("code");
const {
    resourceHintAllowedCors,
    resourceHintAllowedStates,
    resourceHintAllowedTypes
} = require('../../helpers/lib/resourceHints');

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

        const renderer = buildRenderer({}, themeSettings);
        const runTestCases = testRunner({renderer});

        runTestCases([
            {
                input: '{{resourceHints}}',
                output: '<link rel="dns-prefetch preconnect" href="https://fonts.googleapis.com/" crossorigin><link rel="dns-prefetch preconnect" href="https://fonts.gstatic.com/" crossorigin>',
            },
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints).to.have.length(2);
            hints.forEach(hint => {
                expect(hint.cors).to.equals(resourceHintAllowedCors.noCors);
                expect(hint.type).to.equals(resourceHintAllowedTypes.resourceHintFontType);
                expect(hint.state).to.equals(resourceHintAllowedStates.dnsPrefetchResourceHintState);
            });
            done();
        });
    });
});
