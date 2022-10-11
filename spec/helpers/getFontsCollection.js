const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    {testRunner, buildRenderer} = require('../spec-helpers');
const {expect} = require("code");
const {resourceHintAllowedTypes, resourceHintAllowedStates} = require('../../helpers/lib/resourceHints');

describe('getFontsCollection', function () {
    it('should return a font link with fonts from theme settings and &display=swap when no font-display value is passed', function (done) {
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
        const href = "https://fonts.googleapis.com/css?family=Open+Sans:,400italic,700%7CKarla:700%7CLora:400%7CVolkron:%7CDroid:400,700%7CCrimson+Text:400,700&display=swap";
        runTestCases([
            {
                input: '{{getFontsCollection}}',
                output: `<link href="${href}" rel="stylesheet">`,
            },
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints).to.have.length(1);
            expect(hints[0].src).to.equals(href);
            expect(hints[0].state).to.equals(resourceHintAllowedStates.preloadResourceHintState);
            expect(hints[0].type).to.equals(resourceHintAllowedTypes.resourceHintFontType);
            done();
        });
    });
    it('should return a font link with fonts from theme settings and &display=swap when font-display value passed is invalid', function (done) {
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
                input: '{{getFontsCollection font-display="oreo"}}',
                output: '<link href="https://fonts.googleapis.com/css?family=Open+Sans:,400italic,700%7CKarla:700%7CLora:400%7CVolkron:%7CDroid:400,700%7CCrimson+Text:400,700&display=swap" rel="stylesheet">',
            },
        ], done);
    });
    it('should return a font link with fonts from theme settings and &display=${font-display} when valid font-display value is passed', function (done) {
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
                input: '{{getFontsCollection font-display="fallback"}}',
                output: '<link href="https://fonts.googleapis.com/css?family=Open+Sans:,400italic,700%7CKarla:700%7CLora:400%7CVolkron:%7CDroid:400,700%7CCrimson+Text:400,700&display=fallback" rel="stylesheet">',
            },
        ], done);
    });
    it('should not crash if a malformed Google font is passed when no font-display value is passed', function (done) {
        const themeSettings = {
            'test1-font': 'Google_Open+Sans',
            'test2-font': 'Google_',
            'test3-font': 'Google'
        };
        const renderer = buildRenderer({}, themeSettings);
        const runTestCases = testRunner({renderer});
        runTestCases([
            {
                input: '{{getFontsCollection}}',
                output: '<link href="https://fonts.googleapis.com/css?family=Open+Sans:&display=swap" rel="stylesheet">',
            },
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints).to.have.length(1);
            expect(hints[0].state).to.equals(resourceHintAllowedStates.preloadResourceHintState);
            done();
        });
    });
    it('should not crash if a malformed Google font is passed when valid font-display value is passed', function (done) {
        const themeSettings = {
            'test1-font': 'Google_Open+Sans',
            'test2-font': 'Google_',
            'test3-font': 'Google'
        };

        const runTestCases = testRunner({themeSettings});
        runTestCases([
            {
                input: '{{getFontsCollection font-display="fallback"}}',
                output: '<link href="https://fonts.googleapis.com/css?family=Open+Sans:&display=fallback" rel="stylesheet">',
            },
        ], done);
    });
    it('should not crash if a malformed Google font is passed when invalid font-display value is passed', function (done) {
        const themeSettings = {
            'test1-font': 'Google_Open+Sans',
            'test2-font': 'Google_',
            'test3-font': 'Google'
        };

        const runTestCases = testRunner({themeSettings});
        runTestCases([
            {
                input: '{{getFontsCollection font-display="oreo"}}',
                output: '<link href="https://fonts.googleapis.com/css?family=Open+Sans:&display=swap" rel="stylesheet">',
            },
        ], done);
    });
});
