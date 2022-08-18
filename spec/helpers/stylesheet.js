const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it;
const {buildRenderer, testRunner} = require("../spec-helpers");
const {expect} = require("code");
const {resourceHintStyleType} = require("../../helpers/lib/resourceHints").resourceHintAllowedTypes;

describe('stylesheet helper', () => {
    const siteSettings = {
        cdn_url: 'https://cdn.bcapp/hash',
        theme_version_id: '123',
        theme_config_id: 'xyz',
    };

    const runTestCases = testRunner({siteSettings});

    it('should render a link tag with the cdn ulr and stencil-stylesheet data tag', done => {
        const renderer = buildRenderer(siteSettings);
        const runner = testRunner({renderer});
        runner([
            {
                input: '{{{stylesheet "assets/css/style.css" resourceHint="preload"}}}',
                output: '<link data-stencil-stylesheet href="https://cdn.bcapp/hash/stencil/123/css/style-xyz.css" rel="stylesheet">',
            },
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints.length).to.equals(1);
            hints.forEach(({src, type, state}) => {
                expect(src).to.startWith(siteSettings.cdn_url);
                expect(type).to.equals(resourceHintStyleType);
                expect(state).to.equals('preload');
            });
            done();
        });
    });

    it('should render a link tag and all extra attributes with no cdn url', done => {
        runTestCases([
            {
                input: '{{{stylesheet "assets/css/style.css" blah rel="something" class="myStyle"}}}',
                output: '<link data-stencil-stylesheet href="/assets/css/style.css" rel="something" class="myStyle">',
                siteSettings: {},
            },
        ], done);
    });

    it('should render a link with empty href and no resource hint', done => {
        const template = '{{{stylesheet "" }}}';

        const renderer = buildRenderer(siteSettings);
        renderer.renderString(template, {})
            .then(r => {
                expect(r).to.equals('<link data-stencil-stylesheet href="" rel="stylesheet">');
                const hints = renderer.getResourceHints();
                expect(hints).to.have.length(0);
                done();
            })
            .catch(done);
    });

    it('should add configId to the filename', done => {
        const siteSettings = {theme_config_id: 'foo'};
        const renderer = buildRenderer(siteSettings);
        const runner = testRunner({renderer});
        const src = '/assets/css/style-foo.css';
        runner([
            {
                input: '{{{stylesheet "assets/css/style.css" resourceHint="preconnect"}}}',
                output: `<link data-stencil-stylesheet href="${src}" rel="stylesheet">`,
                siteSettings: siteSettings,
            },
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints.length).to.equals(1);
            const hint = hints[0];
            expect(hint.src).to.equals(src);
            expect(hint.state).to.equals('preconnect');
            done();
        });
    });

    it('should not append configId if the file is not in assets/css/ directory', done => {
        runTestCases([
            {
                input: '{{{stylesheet "assets/lib/style.css" }}}',
                output: '<link data-stencil-stylesheet href="/assets/lib/style.css" rel="stylesheet">',
                siteSettings: { theme_config_id: 'foo' },
            },
        ], done);
    });
});
